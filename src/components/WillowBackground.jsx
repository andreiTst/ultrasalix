import { useEffect, useRef } from 'react'

// Keep in sync with the wide-layout media query in App.css
export const WIDE_QUERY = '(min-width: 900px) and (orientation: landscape)'

const WOOD = '#9a89a2'
const STRAND_FRONT = '#ac9cb3'
const STRAND_BACK = '#cbbfd1'
const LEAF_FRONT = ['#b39fbe', '#c4b1cd', '#a58fb0']
const LEAF_BACK = ['#d6cadc', '#dfd4e4']
const FALLING_LEAF_COLORS = ['#826d8c', '#aa91b6', '#c8b2d2']

const SEGMENTS = 14
const GRAVITY = 0.2
const DAMPING = 0.97
const ITERATIONS = 5
const BEND_BASE = 0.45
const BEND_TIP = 0.04
const MOUSE_RADIUS = 150
const MOUSE_PUSH = 0.7
const MOUSE_DRAG = 0.13
const STEP_MS = 1000 / 60
const BEND_STIFFNESS = Array.from({ length: SEGMENTS - 1 }, (_, i) => BEND_BASE + (BEND_TIP - BEND_BASE) * (i / (SEGMENTS - 2)))
// Wind phase shifts ~0.1 rad per node; sin(A + i*k) expanded with lookup tables
const WIND_COS = Array.from({ length: SEGMENTS + 1 }, (_, i) => Math.cos(i * 0.1))
const WIND_SIN = Array.from({ length: SEGMENTS + 1 }, (_, i) => Math.sin(i * 0.1))
const LEAF_COS = Math.cos(0.32)
const LEAF_SIN = Math.sin(0.32)
// Canvas only covers the tree side of the hero (fewer pixels to raster each frame)
const CANVAS_LEFT = 0.3
const POP_FRAMES = 28
const IDLE_MS = 3000

// Trunk forks into two boughs; limbs grow from the boughs; strands hang from both.
// Angles are radians from vertical (negative = left).
const BOUGHS = [
    { angle: -0.6, length: 0.24, limbs: [{ t: 0.45, angle: -1.35 }, { t: 0.7, angle: -0.95 }, { t: 0.9, angle: -0.45 }, { t: 1, angle: 0.22 }] },
    { angle: 0.52, length: 0.22, limbs: [{ t: 0.5, angle: 1.3 }, { t: 0.72, angle: 0.92 }, { t: 0.9, angle: 0.42 }, { t: 1, angle: -0.25 }] }
]

function seededRandom(seed) {
    let a = seed
    return () => {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

// 'hero': tree in the right half, text in the left column.
// 'full': tree centered and sized to the whole viewport (portrait phones included).
function computeLayout(w, h, variant) {
    if (variant === 'full') {
        const scale = Math.min(w * 1.2, h * 0.95)
        return {
            ox: w * 0.5,
            groundY: h + 10,
            forkY: h - Math.max(scale * 0.44, h * 0.45),
            scale,
            trunkTopW: scale * 0.05,
            trunkBaseW: scale * 0.075
        }
    }
    const scale = Math.min(w * 0.42, h * 0.95)
    return {
        ox: w * 0.73,
        groundY: h + 10,
        forkY: h * 0.64,
        scale,
        trunkTopW: scale * 0.05,
        trunkBaseW: scale * 0.075
    }
}

function buildTree(layout) {
    const rand = seededRandom(11)
    const { scale } = layout
    const branches = []

    BOUGHS.forEach((b) => {
        const boughIndex = branches.length
        branches.push({
            parent: -1,
            t: 1,
            angle: b.angle + (rand() - 0.5) * 0.06,
            length: scale * b.length,
            widthRatio: 0.78,
            endRatio: 0.55,
            droop: 0.04,
            sway: 0.25,
            offset: 0,
            vel: 0,
            phase: rand() * Math.PI * 2
        })
        b.limbs.forEach((l) => {
            branches.push({
                parent: boughIndex,
                t: l.t,
                angle: l.angle + (rand() - 0.5) * 0.08,
                length: scale * (0.24 + rand() * 0.1),
                widthRatio: 0.78,
                endRatio: 0.16,
                droop: 0.08 + Math.abs(Math.sin(l.angle)) * 0.3,
                sway: 1,
                offset: 0,
                vel: 0,
                phase: rand() * Math.PI * 2
            })
        })
    })

    const strands = []
    const leafLen = Math.max(5, Math.min(10, scale * 0.016))
    const addStrand = (branchIndex, t, lengthMul) => {
        const back = rand() < 0.35
        const palette = back ? LEAF_BACK : LEAF_FRONT
        const side = branches[branchIndex].angle >= 0 ? 1 : -1
        // Draw order matters: keeps the seeded tree shape stable
        const length = scale * (0.24 + rand() * 0.5) * lengthMul
        const launch = (0.45 + rand() * 0.6) * side
        const phase = rand() * Math.PI * 2
        const leafSeed = Math.floor(rand() * 7)
        const leafLens = []
        const leafSides = []
        for (let i = 0; i <= SEGMENTS; i++) {
            leafLens.push(leafLen * (0.75 + ((i * 7 + leafSeed) % 4) * 0.12))
            leafSides.push((i + leafSeed) % 2 === 0 ? 1 : -1)
        }
        strands.push({
            branch: branchIndex,
            t,
            length,
            launch,
            phase,
            leafLens,
            leafSides,
            back,
            color: back ? STRAND_BACK : STRAND_FRONT,
            leafColor: palette[Math.floor(rand() * palette.length)],
            widths: null,
            anchor: null,
            nodes: null
        })
    }

    branches.forEach((br, i) => {
        if (br.parent === -1) {
            addStrand(i, 0.75, 0.9)
            addStrand(i, 0.95, 1)
            return
        }
        const count = 6 + Math.floor(rand() * 2)
        for (let k = 0; k < count; k++) {
            addStrand(i, 0.2 + (k / (count - 1)) * 0.8, 1)
        }
    })

    const groupByColor = (list) => {
        const map = new Map()
        for (const s of list) {
            if (!map.has(s.leafColor)) map.set(s.leafColor, [])
            map.get(s.leafColor).push(s)
        }
        return [...map.entries()]
    }
    const backStrands = strands.filter((s) => s.back)
    const frontStrands = strands.filter((s) => !s.back)

    return {
        ...layout,
        branches,
        strands,
        backStrands,
        frontStrands,
        backLeafGroups: groupByColor(backStrands),
        frontLeafGroups: groupByColor(frontStrands)
    }
}

// Reused scratch buffers so ribbon drawing allocates nothing per frame
const LX = new Float64Array(32)
const LY = new Float64Array(32)
const RX = new Float64Array(32)
const RY = new Float64Array(32)

function drawRibbon(ctx, pts, widths, color) {
    const n = pts.length
    for (let i = 0; i < n; i++) {
        const a = pts[i > 0 ? i - 1 : 0]
        const b = pts[i < n - 1 ? i + 1 : n - 1]
        let tx = b.x - a.x
        let ty = b.y - a.y
        const len = Math.sqrt(tx * tx + ty * ty) || 1
        const hw = widths[i] / 2 / len
        tx *= hw
        ty *= hw
        LX[i] = pts[i].x - ty
        LY[i] = pts[i].y + tx
        RX[i] = pts[i].x + ty
        RY[i] = pts[i].y - tx
    }

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(LX[0], LY[0])
    for (let i = 1; i < n - 1; i++) {
        ctx.quadraticCurveTo(LX[i], LY[i], (LX[i] + LX[i + 1]) / 2, (LY[i] + LY[i + 1]) / 2)
    }
    ctx.lineTo(LX[n - 1], LY[n - 1])
    ctx.lineTo(RX[n - 1], RY[n - 1])
    for (let i = n - 2; i > 0; i--) {
        ctx.quadraticCurveTo(RX[i], RY[i], (RX[i] + RX[i - 1]) / 2, (RY[i] + RY[i - 1]) / 2)
    }
    ctx.lineTo(RX[0], RY[0])
    ctx.fill()

    ctx.beginPath()
    ctx.arc(pts[0].x, pts[0].y, widths[0] / 2, 0, Math.PI * 2)
    ctx.fill()
}

function drawFallingLeaf(ctx, size) {
    ctx.beginPath()
    ctx.moveTo(0, -size)
    ctx.bezierCurveTo(size * 0.55, -size * 0.35, size * 0.55, size * 0.35, 0, size)
    ctx.bezierCurveTo(-size * 0.55, size * 0.35, -size * 0.55, -size * 0.35, 0, -size)
    ctx.closePath()
    ctx.fill()
}

function samplePath(geo, t) {
    const f = t * (geo.pts.length - 1)
    const i = Math.min(geo.pts.length - 2, Math.floor(f))
    const r = f - i
    const lerp = (a, b) => a + (b - a) * r
    const tx = lerp(geo.tangents[i].x, geo.tangents[i + 1].x)
    const ty = lerp(geo.tangents[i].y, geo.tangents[i + 1].y)
    const len = Math.hypot(tx, ty) || 1
    return {
        x: lerp(geo.pts[i].x, geo.pts[i + 1].x),
        y: lerp(geo.pts[i].y, geo.pts[i + 1].y),
        w: lerp(geo.widths[i], geo.widths[i + 1]),
        tx: tx / len,
        ty: ty / len
    }
}

export default function WillowBackground({ variant = 'hero' }) {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const canvasLeft = variant === 'hero' ? CANVAS_LEFT : 0
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return undefined

        const ctx = canvas.getContext('2d')
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        let width = 0
        let height = 0
        let offsetX = 0
        let containerLeft = 0
        let containerTop = 0
        let tree = null
        let falling = []
        let animationId = null
        let lastFrame = 0
        let accumulator = 0
        let time = 0
        let lastInteraction = 0
        let frameCount = 0

        const mouse = { x: -9999, y: -9999, lastX: -9999, lastY: -9999, vx: 0, vy: 0, active: false }

        const trunkGeometry = () => {
            const { ox, groundY, forkY, scale, trunkTopW, trunkBaseW } = tree
            const pts = []
            const widths = []
            const tangents = []
            const N = 12
            for (let i = 0; i < N; i++) {
                const t = i / (N - 1)
                pts.push({
                    x: ox + Math.sin(t * Math.PI) * scale * 0.025 - (1 - t) * scale * 0.015,
                    y: groundY + (forkY - groundY) * t
                })
                tangents.push({ x: 0, y: -1 })
                const flare = Math.max(0, 1 - t * 6) ** 2 * trunkBaseW * 0.35
                widths.push(trunkTopW + (trunkBaseW - trunkTopW) * (1 - t) ** 1.5 + flare)
            }
            return { pts, widths, tangents }
        }

        const branchGeometry = (br, parentGeo) => {
            const start = samplePath(parentGeo, br.t)
            const a = br.angle + br.offset + Math.sin(time * 0.5 + br.phase) * 0.012 * br.sway
            const L = br.length
            const dirX = Math.sin(a)
            const dirY = -Math.cos(a)
            // Leave the parent along its tangent, then turn toward the branch direction
            let cx = start.tx * 0.6 + dirX
            let cy = start.ty * 0.6 + dirY
            const clen = Math.hypot(cx, cy) || 1
            cx /= clen
            cy /= clen
            const sx = start.x - start.tx * start.w * 0.25
            const sy = start.y - start.ty * start.w * 0.25
            const qx = sx + cx * L * 0.45
            const qy = sy + cy * L * 0.45
            // Outer limbs arch back down at their tips, giving the crown its dome
            const ex = sx + dirX * L
            const ey = sy + dirY * L + L * br.droop

            const w0 = start.w * br.widthRatio
            const w1 = Math.max(1.6, w0 * br.endRatio)
            const N = 10
            const pts = []
            const widths = []
            const tangents = []
            for (let i = 0; i < N; i++) {
                const t = i / (N - 1)
                const mt = 1 - t
                pts.push({
                    x: mt * mt * sx + 2 * mt * t * qx + t * t * ex,
                    y: mt * mt * sy + 2 * mt * t * qy + t * t * ey
                })
                const dx = 2 * mt * (qx - sx) + 2 * t * (ex - qx)
                const dy = 2 * mt * (qy - sy) + 2 * t * (ey - qy)
                const len = Math.hypot(dx, dy) || 1
                tangents.push({ x: dx / len, y: dy / len })
                widths.push(w0 + (w1 - w0) * t ** 0.8)
            }
            return { pts, widths, tangents }
        }

        const computeGeometry = () => {
            const trunk = tree.trunk
            const geos = []
            tree.branches.forEach((br, i) => {
                geos[i] = branchGeometry(br, br.parent === -1 ? trunk : geos[br.parent])
            })
            return { trunk, geos }
        }

        const strandAnchor = (s, geos) => {
            const p = samplePath(geos[s.branch], s.t)
            const c = Math.cos(s.launch)
            const sn = Math.sin(s.launch)
            let dx = p.tx * c - p.ty * sn
            let dy = p.tx * sn + p.ty * c
            const len = Math.hypot(dx, dy) || 1
            return { x: p.x, y: p.y, w: p.w, dx: dx / len, dy: dy / len }
        }

        const initStrand = (s, anchor) => {
            const seg = s.length / SEGMENTS
            let dx = anchor.dx
            let dy = anchor.dy
            let x = anchor.x
            let y = anchor.y
            s.nodes = []
            for (let i = 0; i <= SEGMENTS; i++) {
                s.nodes.push({ x, y, px: x, py: y })
                if (i >= 1) {
                    dx += (0 - dx) * 0.2
                    dy += (1 - dy) * 0.2
                    const len = Math.hypot(dx, dy) || 1
                    dx /= len
                    dy /= len
                }
                x += dx * seg
                y += dy * seg
            }
        }

        const stepStrand = (s, anchor) => {
            const nodes = s.nodes
            const seg = s.length / SEGMENTS

            nodes[0].x = anchor.x
            nodes[0].y = anchor.y
            nodes[1].x = anchor.x + anchor.dx * seg
            nodes[1].y = anchor.y + anchor.dy * seg

            const windPhase = time * 0.8 + s.phase
            const windSin = Math.sin(windPhase) * 0.02
            const windCos = Math.cos(windPhase) * 0.02
            const gust = Math.sin(time * 2.1 + anchor.x * 0.012) * 0.008

            for (let i = 2; i <= SEGMENTS; i++) {
                const n = nodes[i]
                const vx = (n.x - n.px) * DAMPING
                const vy = (n.y - n.py) * DAMPING
                let ax = (windSin * WIND_COS[i] + windCos * WIND_SIN[i] + gust) * (i / SEGMENTS)
                let ay = GRAVITY

                if (mouse.active) {
                    const mx = n.x - mouse.x
                    const my = n.y - mouse.y
                    if (mx < MOUSE_RADIUS && mx > -MOUSE_RADIUS && my < MOUSE_RADIUS && my > -MOUSE_RADIUS) {
                        const d = Math.sqrt(mx * mx + my * my)
                        if (d < MOUSE_RADIUS && d > 0.001) {
                            const f = 1 - d / MOUSE_RADIUS
                            ax += (mx / d) * f * f * MOUSE_PUSH + mouse.vx * f * MOUSE_DRAG
                            ay += (my / d) * f * f * MOUSE_PUSH + mouse.vy * f * MOUSE_DRAG
                        }
                    }
                }

                n.px = n.x
                n.py = n.y
                n.x += vx + ax
                n.y += vy + ay
            }

            for (let iter = 0; iter < ITERATIONS; iter++) {
                for (let i = 1; i < SEGMENTS; i++) {
                    const a = nodes[i]
                    const b = nodes[i + 1]
                    const dx = b.x - a.x
                    const dy = b.y - a.y
                    const d = Math.sqrt(dx * dx + dy * dy) || 0.001
                    const diff = (d - seg) / d
                    if (i === 1) {
                        b.x -= dx * diff
                        b.y -= dy * diff
                    } else {
                        a.x += dx * diff * 0.5
                        a.y += dy * diff * 0.5
                        b.x -= dx * diff * 0.5
                        b.y -= dy * diff * 0.5
                    }
                }
                // Bending: stiff near the branch, limp toward the tip
                for (let i = 0; i < SEGMENTS - 1; i++) {
                    const a = nodes[i]
                    const c = nodes[i + 2]
                    const dx = c.x - a.x
                    const dy = c.y - a.y
                    const d = Math.sqrt(dx * dx + dy * dy) || 0.001
                    const stiffness = BEND_STIFFNESS[i]
                    const diff = ((d - seg * 1.96) / d) * stiffness
                    if (i <= 1) {
                        c.x -= dx * diff
                        c.y -= dy * diff
                    } else {
                        a.x += dx * diff * 0.5
                        a.y += dy * diff * 0.5
                        c.x -= dx * diff * 0.5
                        c.y -= dy * diff * 0.5
                    }
                }
            }
        }

        const stepBranch = (br, geo) => {
            if (mouse.active) {
                const end = geo.pts[geo.pts.length - 1]
                const mx = end.x - mouse.x
                const my = end.y - mouse.y
                const d = Math.hypot(mx, my)
                if (d < MOUSE_RADIUS) {
                    const f = 1 - d / MOUSE_RADIUS
                    br.vel += (Math.sign(mx) * f * 0.0012 + mouse.vx * f * 0.00024) * br.sway
                }
            }
            br.vel += -br.offset * 0.04
            br.vel *= 0.88
            const max = 0.1 * br.sway
            br.offset = Math.max(-max, Math.min(max, br.offset + br.vel))
        }

        const spawnFallingLeaf = (p) => {
            const s = tree.strands[Math.floor(Math.random() * tree.strands.length)]
            const node = s.nodes[4 + Math.floor(Math.random() * (SEGMENTS - 4))]
            p.x = node.x
            p.y = node.y
            p.vx = 0
            p.vy = 0
            p.age = 0
        }

        const stepFallingLeaf = (p) => {
            p.age++
            p.vy = Math.min(p.vy + 0.004, p.fall)
            p.vx *= 0.96
            p.vy *= 0.99
            p.vx += Math.sin(time * p.swayFreq + p.phase) * 0.012
            if (mouse.active) {
                const mx = p.x - mouse.x
                const my = p.y - mouse.y
                const d = Math.hypot(mx, my)
                if (d < MOUSE_RADIUS && d > 0.001) {
                    const f = 1 - d / MOUSE_RADIUS
                    p.vx += (mx / d) * f * 0.35 + mouse.vx * f * 0.05
                    p.vy += (my / d) * f * 0.35 + mouse.vy * f * 0.05
                }
            }
            p.x += p.vx
            p.y += p.vy
            p.rot += p.vx * 0.05
            if (p.y - p.size > height || p.x < offsetX - 40 || p.x > width + 40) {
                spawnFallingLeaf(p)
            }
        }

        let currentGeometry = null

        const simulate = () => {
            time += 1 / 60
            currentGeometry = computeGeometry()
            const { geos } = currentGeometry
            tree.branches.forEach((br, i) => stepBranch(br, geos[i]))
            for (const s of tree.strands) {
                s.anchor = strandAnchor(s, geos)
                stepStrand(s, s.anchor)
            }
            for (const p of falling) stepFallingLeaf(p)
        }

        // All leaves of one color go into a single path -> one fill call per color
        const drawLeafLayer = (groups) => {
            for (const [color, list] of groups) {
                ctx.fillStyle = color
                ctx.beginPath()
                for (const s of list) {
                    const nodes = s.nodes
                    for (let i = 3; i <= SEGMENTS; i++) {
                        const a = nodes[i - 1]
                        const b = nodes[i]
                        let dx = b.x - a.x
                        let dy = b.y - a.y
                        const inv = 1 / (Math.sqrt(dx * dx + dy * dy) || 1)
                        dx *= inv
                        dy *= inv
                        // One narrow leaf per segment, alternating sides, rotated ±0.32 rad off the strand
                        const side = s.leafSides[i]
                        const len = s.leafLens[i]
                        const ux = dx * LEAF_COS - dy * LEAF_SIN * side
                        const uy = dx * LEAF_SIN * side + dy * LEAF_COS
                        // Thin diamond: visually identical to an ellipse at this size, much cheaper
                        const cx = a.x + ux * len * 0.95
                        const cy = a.y + uy * len * 0.95
                        const hx = -uy * 1.9
                        const hy = ux * 1.9
                        ctx.moveTo(cx - ux * len, cy - uy * len)
                        ctx.lineTo(cx + hx, cy + hy)
                        ctx.lineTo(cx + ux * len, cy + uy * len)
                        ctx.lineTo(cx - hx, cy - hy)
                    }
                }
                ctx.fill()
            }
        }

        const drawStrandLayer = (strands, leafGroups) => {
            for (const s of strands) drawRibbon(ctx, s.nodes, s.widths, s.color)
            drawLeafLayer(leafGroups)
        }

        const draw = () => {
            ctx.clearRect(offsetX, 0, width - offsetX, height)
            const { trunk, geos } = currentGeometry

            drawStrandLayer(tree.backStrands, tree.backLeafGroups)

            drawRibbon(ctx, trunk.pts, trunk.widths, WOOD)
            for (const geo of geos) drawRibbon(ctx, geo.pts, geo.widths, WOOD)

            drawStrandLayer(tree.frontStrands, tree.frontLeafGroups)

            for (const p of falling) {
                const grow = easeOutBack(Math.min(1, p.age / POP_FRAMES))
                if (grow <= 0) continue
                ctx.save()
                ctx.translate(p.x, p.y)
                ctx.rotate(p.rot)
                ctx.scale(grow, grow)
                ctx.globalAlpha = p.alpha
                ctx.fillStyle = p.color
                drawFallingLeaf(ctx, p.size)
                ctx.restore()
            }
        }

        const resize = () => {
            const rect = container.getBoundingClientRect()
            containerLeft = rect.left
            containerTop = rect.top
            if (rect.width === width && rect.height === height) return
            width = rect.width
            height = rect.height
            offsetX = Math.round(width * canvasLeft)
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
            canvas.style.left = `${offsetX}px`
            canvas.style.width = `${width - offsetX}px`
            canvas.width = (width - offsetX) * dpr
            canvas.height = height * dpr
            ctx.setTransform(dpr, 0, 0, dpr, -offsetX * dpr, 0)

            tree = buildTree(computeLayout(width, height, variant))
            tree.trunk = trunkGeometry()
            falling = []
            const { geos } = computeGeometry()
            for (const s of tree.strands) initStrand(s, strandAnchor(s, geos))

            const wasActive = mouse.active
            mouse.active = false
            for (let i = 0; i < 180; i++) simulate()
            mouse.active = wasActive

            for (const s of tree.strands) {
                const baseW = Math.max(1.2, Math.min(6, s.anchor.w * 0.55))
                s.widths = s.nodes.map((_, i) => baseW + (0.7 - baseW) * (i / SEGMENTS) ** 0.6)
            }

            falling = Array.from({ length: 9 }, (_, i) => {
                const p = {
                    x: 0, y: 0, vx: 0, vy: 0, age: 0,
                    fall: 0.35 + Math.random() * 0.4,
                    size: 4 + Math.random() * 4,
                    rot: Math.random() * Math.PI,
                    swayFreq: 0.6 + Math.random() * 0.6,
                    phase: Math.random() * Math.PI * 2,
                    color: FALLING_LEAF_COLORS[i % FALLING_LEAF_COLORS.length],
                    alpha: 0.35 + Math.random() * 0.25
                }
                spawnFallingLeaf(p)
                p.age = -i * 20
                return p
            })

            if (reduceMotion) draw()
        }

        const setMouse = (clientX, clientY) => {
            mouse.x = clientX - containerLeft
            mouse.y = clientY - containerTop
            if (!mouse.active) {
                mouse.lastX = mouse.x
                mouse.lastY = mouse.y
            }
            mouse.active = true
            lastInteraction = performance.now()
        }
        const handleMouseMove = (e) => setMouse(e.clientX, e.clientY)
        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) setMouse(e.touches[0].clientX, e.touches[0].clientY)
        }
        const handleMouseLeave = () => {
            mouse.active = false
            mouse.vx = 0
            mouse.vy = 0
        }

        const frame = (now) => {
            if (!lastFrame) lastFrame = now
            accumulator += Math.min(100, now - lastFrame)
            lastFrame = now

            if (mouse.active) {
                const steps = Math.max(1, Math.round(accumulator / STEP_MS))
                const rawVx = Math.max(-40, Math.min(40, mouse.x - mouse.lastX)) / steps
                const rawVy = Math.max(-40, Math.min(40, mouse.y - mouse.lastY)) / steps
                mouse.lastX = mouse.x
                mouse.lastY = mouse.y
                mouse.vx = mouse.vx * 0.5 + rawVx * 0.5
                mouse.vy = mouse.vy * 0.5 + rawVy * 0.5
            }

            let steps = 0
            while (accumulator >= STEP_MS && steps < 4) {
                simulate()
                accumulator -= STEP_MS
                steps++
            }
            if (steps === 4) accumulator = 0

            // Idle (no pointer activity): render at half rate; physics still advances at 60Hz
            frameCount++
            const idle = now - lastInteraction > IDLE_MS
            if (steps > 0 && (!idle || frameCount % 2 === 0)) draw()
            animationId = requestAnimationFrame(frame)
        }

        resize()
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('touchstart', handleTouchMove, { passive: true })
        window.addEventListener('touchmove', handleTouchMove, { passive: true })
        window.addEventListener('touchend', handleMouseLeave)
        window.addEventListener('touchcancel', handleMouseLeave)
        document.addEventListener('mouseleave', handleMouseLeave)

        if (!reduceMotion) {
            animationId = requestAnimationFrame(frame)
        }

        return () => {
            if (animationId) cancelAnimationFrame(animationId)
            resizeObserver.disconnect()
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchstart', handleTouchMove)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('touchend', handleMouseLeave)
            window.removeEventListener('touchcancel', handleMouseLeave)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [variant])

    return (
        <div className="willow-bg" ref={containerRef} aria-hidden="true">
            <canvas ref={canvasRef} />
        </div>
    )
}
