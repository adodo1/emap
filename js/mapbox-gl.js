(function(f) {
    if (typeof exports === "object" && typeof module !== "undefined") { module.exports = f() } else if (typeof define === "function" && define.amd) { define([], f) } else {
        var g;
        if (typeof window !== "undefined") { g = window } else if (typeof global !== "undefined") { g = global } else if (typeof self !== "undefined") { g = self } else { g = this }
        g.mapboxgl = f() } })(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;
                    if (!u && a) return a(o, !0);
                    if (i) return i(o, !0);
                    var f = new Error("Cannot find module '" + o + "'");
                    throw f.code = "MODULE_NOT_FOUND", f }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e) }, l, l.exports, e, t, n, r) }
            return n[o].exports }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s })({
        1: [function(require, module, exports) {
            "use strict";

            function ArrayGroup(r) {
                var e = r.layoutVertexArrayType;
                this.layoutVertexArray = new e;
                var t = r.elementArrayType;
                t && (this.elementArray = new t);
                var a = r.elementArrayType2;
                a && (this.elementArray2 = new a), this.paintVertexArrays = util.mapObject(r.paintVertexArrayTypes, function(r) {
                    return new r }) }
            var util = require("../util/util");
            module.exports = ArrayGroup, ArrayGroup.MAX_VERTEX_ARRAY_LENGTH = Math.pow(2, 16) - 1, ArrayGroup.prototype.hasCapacityFor = function(r) {
                return this.layoutVertexArray.length + r <= ArrayGroup.MAX_VERTEX_ARRAY_LENGTH }, ArrayGroup.prototype.isEmpty = function() {
                return 0 === this.layoutVertexArray.length }, ArrayGroup.prototype.trim = function() { this.layoutVertexArray.trim(), this.elementArray && this.elementArray.trim(), this.elementArray2 && this.elementArray2.trim();
                for (var r in this.paintVertexArrays) this.paintVertexArrays[r].trim() }, ArrayGroup.prototype.serialize = function() {
                return { layoutVertexArray: this.layoutVertexArray.serialize(), elementArray: this.elementArray && this.elementArray.serialize(), elementArray2: this.elementArray2 && this.elementArray2.serialize(), paintVertexArrays: util.mapObject(this.paintVertexArrays, function(r) {
                        return r.serialize() }) } }, ArrayGroup.prototype.getTransferables = function(r) { r.push(this.layoutVertexArray.arrayBuffer), this.elementArray && r.push(this.elementArray.arrayBuffer), this.elementArray2 && r.push(this.elementArray2.arrayBuffer);
                for (var e in this.paintVertexArrays) r.push(this.paintVertexArrays[e].arrayBuffer) };
        }, { "../util/util": 122 }],
        2: [function(require, module, exports) {
            "use strict";

            function Bucket(e) {
                if (this.zoom = e.zoom, this.overscaling = e.overscaling, this.layer = e.layer, this.childLayers = e.childLayers, this.type = this.layer.type, this.features = [], this.id = this.layer.id, this.index = e.index, this.sourceLayer = this.layer.sourceLayer, this.sourceLayerIndex = e.sourceLayerIndex, this.minZoom = this.layer.minzoom, this.maxZoom = this.layer.maxzoom, this.paintAttributes = createPaintAttributes(this), e.arrays) {
                    var r = this.programInterfaces;
                    this.bufferGroups = util.mapObject(e.arrays, function(t, a) {
                        var i = r[a],
                            n = e.paintVertexArrayTypes[a];
                        return t.map(function(e) {
                            return new BufferGroup(e, { layoutVertexArrayType: i.layoutVertexArrayType.serialize(), elementArrayType: i.elementArrayType && i.elementArrayType.serialize(), elementArrayType2: i.elementArrayType2 && i.elementArrayType2.serialize(), paintVertexArrayTypes: n }) }) }) } }

            function createPaintAttributes(e) {
                var r = {};
                for (var t in e.programInterfaces) {
                    for (var a = r[t] = {}, i = 0; i < e.childLayers.length; i++) {
                        var n = e.childLayers[i];
                        a[n.id] = { attributes: [], uniforms: [], defines: [], vertexPragmas: { define: {}, initialize: {} }, fragmentPragmas: { define: {}, initialize: {} } } }
                    var o = e.programInterfaces[t];
                    if (o.paintAttributes)
                        for (var s = "{precision}", u = "{type}", l = 0; l < o.paintAttributes.length; l++) {
                            var y = o.paintAttributes[l];
                            y.multiplier = y.multiplier || 1;
                            for (var p = 0; p < e.childLayers.length; p++) {
                                var c, f = e.childLayers[p],
                                    m = a[f.id],
                                    h = y.name,
                                    g = y.name.slice(2);
                                if (m.fragmentPragmas.initialize[g] = "", f.isPaintValueFeatureConstant(y.paintProperty)) m.uniforms.push(y), m.fragmentPragmas.define[g] = m.vertexPragmas.define[g] = ["uniform", s, u, h].join(" ") + ";", m.fragmentPragmas.initialize[g] = m.vertexPragmas.initialize[g] = [s, u, g, "=", h].join(" ") + ";\n";
                                else if (f.isPaintValueZoomConstant(y.paintProperty)) { m.attributes.push(util.extend({}, y, { name: h })), c = ["varying", s, u, g].join(" ") + ";\n";
                                    var v = [m.fragmentPragmas.define[g], "attribute", s, u, h].join(" ") + ";\n";
                                    m.fragmentPragmas.define[g] = c, m.vertexPragmas.define[g] = c + v, m.vertexPragmas.initialize[g] = [g, "=", h, "/", y.multiplier.toFixed(1)].join(" ") + ";\n" } else {
                                    for (var d = "u_" + h.slice(2) + "_t", x = f.getPaintValueStopZoomLevels(y.paintProperty), A = 0; A < x.length && x[A] < e.zoom;) A++;
                                    for (var b = Math.max(0, Math.min(x.length - 4, A - 2)), T = [], V = 0; V < 4; V++) T.push(x[Math.min(b + V, x.length - 1)]);
                                    c = ["varying", s, u, g].join(" ") + ";\n", m.vertexPragmas.define[g] = c + ["uniform", "lowp", "float", d].join(" ") + ";\n", m.fragmentPragmas.define[g] = c, m.uniforms.push(util.extend({}, y, { name: d, getValue: createGetUniform(y, b), components: 1 }));
                                    var P = y.components;
                                    if (1 === P) m.attributes.push(util.extend({}, y, { getValue: createFunctionGetValue(y, T), isFunction: !0, components: 4 * P })), m.vertexPragmas.define[g] += ["attribute", s, "vec4", h].join(" ") + ";\n", m.vertexPragmas.initialize[g] = [g, "=", "evaluate_zoom_function_1(" + h + ", " + d + ")", "/", y.multiplier.toFixed(1)].join(" ") + ";\n";
                                    else {
                                        for (var k = [], z = 0; z < 4; z++) k.push(h + z), m.attributes.push(util.extend({}, y, { getValue: createFunctionGetValue(y, [T[z]]), isFunction: !0, name: h + z })), m.vertexPragmas.define[g] += ["attribute", s, u, h + z].join(" ") + ";\n";
                                        m.vertexPragmas.initialize[g] = [g, " = ", "evaluate_zoom_function_4(" + k.join(", ") + ", " + d + ")", "/", y.multiplier.toFixed(1)].join(" ") + ";\n" } } } } }
                return r }

            function createFunctionGetValue(e, r) {
                return function(t, a, i) {
                    if (1 === r.length) return e.getValue(t, util.extend({}, a, { zoom: r[0] }), i);
                    for (var n = [], o = 0; o < r.length; o++) {
                        var s = r[o];
                        n.push(e.getValue(t, util.extend({}, a, { zoom: s }), i)[0]) }
                    return n } }

            function createGetUniform(e, r) {
                return function(t, a) {
                    var i = t.getPaintInterpolationT(e.paintProperty, a.zoom);
                    return [Math.max(0, Math.min(4, i - r))] } }
            var ArrayGroup = require("./array_group"),
                BufferGroup = require("./buffer_group"),
                util = require("../util/util"),
                StructArrayType = require("../util/struct_array");
            module.exports = Bucket, Bucket.create = function(e) {
                var r = { fill: require("./bucket/fill_bucket"), fillextrusion: require("./bucket/fill_extrusion_bucket"), line: require("./bucket/line_bucket"), circle: require("./bucket/circle_bucket"), symbol: require("./bucket/symbol_bucket") },
                    t = e.layer.type;
                return "fill" !== t || e.layer.isPaintValueFeatureConstant("fill-extrude-height") && e.layer.isPaintValueZoomConstant("fill-extrude-height") && 0 === e.layer.getPaintValue("fill-extrude-height") || (t = "fillextrusion"), new r[t](e) }, Bucket.EXTENT = 8192, Bucket.prototype.populateArrays = function() { this.createArrays(), this.recalculateStyleLayers();
                for (var e = 0; e < this.features.length; e++) this.addFeature(this.features[e]);
                this.trimArrays() }, Bucket.prototype.prepareArrayGroup = function(e, r) {
                var t = this.arrayGroups[e],
                    a = t.length && t[t.length - 1];
                return a && a.hasCapacityFor(r) || (a = new ArrayGroup({ layoutVertexArrayType: this.programInterfaces[e].layoutVertexArrayType, elementArrayType: this.programInterfaces[e].elementArrayType, elementArrayType2: this.programInterfaces[e].elementArrayType2, paintVertexArrayTypes: this.paintVertexArrayTypes[e] }), a.index = t.length, t.push(a)), a }, Bucket.prototype.createArrays = function() { this.arrayGroups = {}, this.paintVertexArrayTypes = {};
                for (var e in this.programInterfaces) { this.arrayGroups[e] = [];
                    var r = this.paintVertexArrayTypes[e] = {},
                        t = this.paintAttributes[e];
                    for (var a in t) r[a] = new Bucket.VertexArrayType(t[a].attributes) } }, Bucket.prototype.destroy = function() {
                for (var e in this.bufferGroups)
                    for (var r = this.bufferGroups[e], t = 0; t < r.length; t++) r[t].destroy() }, Bucket.prototype.trimArrays = function() {
                for (var e in this.arrayGroups)
                    for (var r = this.arrayGroups[e], t = 0; t < r.length; t++) r[t].trim() }, Bucket.prototype.isEmpty = function() {
                for (var e in this.arrayGroups)
                    for (var r = this.arrayGroups[e], t = 0; t < r.length; t++)
                        if (!r[t].isEmpty()) return !1;
                return !0 }, Bucket.prototype.getTransferables = function(e) {
                for (var r in this.arrayGroups)
                    for (var t = this.arrayGroups[r], a = 0; a < t.length; a++) t[a].getTransferables(e) }, Bucket.prototype.setUniforms = function(e, r, t, a, i) {
                for (var n = this.paintAttributes[r][a.id].uniforms, o = 0; o < n.length; o++) {
                    var s = n[o],
                        u = t[s.name];
                    e["uniform" + s.components + "fv"](u, s.getValue(a, i)) } }, Bucket.prototype.serialize = function() {
                return { layerId: this.layer.id, zoom: this.zoom, arrays: util.mapObject(this.arrayGroups, function(e) {
                        return e.map(function(e) {
                            return e.serialize() }) }), paintVertexArrayTypes: util.mapObject(this.paintVertexArrayTypes, function(e) {
                        return util.mapObject(e, function(e) {
                            return e.serialize() }) }), childLayerIds: this.childLayers.map(function(e) {
                        return e.id }) } };
            var FAKE_ZOOM_HISTORY = { lastIntegerZoom: 1 / 0, lastIntegerZoomTime: 0, lastZoom: 0 };
            Bucket.prototype.recalculateStyleLayers = function() {
                for (var e = 0; e < this.childLayers.length; e++) this.childLayers[e].recalculate(this.zoom, FAKE_ZOOM_HISTORY) }, Bucket.prototype.populatePaintArrays = function(e, r, t, a, i) {
                for (var n = 0; n < this.childLayers.length; n++)
                    for (var o = this.childLayers[n], s = this.arrayGroups[e], u = a.index; u < s.length; u++) {
                        var l = s[u],
                            y = l.layoutVertexArray.length,
                            p = l.paintVertexArrays[o.id];
                        p.resize(y);
                        for (var c = this.paintAttributes[e][o.id].attributes, f = 0; f < c.length; f++)
                            for (var m = c[f], h = m.getValue(o, r, t), g = m.multiplier || 1, v = m.components || 1, d = u === a.index ? i : 0, x = d; x < y; x++)
                                for (var A = p.get(x), b = 0; b < v; b++) {
                                    var T = v > 1 ? m.name + b : m.name;
                                    A[T] = h[b] * g } } }, Bucket.VertexArrayType = function(e) {
                return new StructArrayType({ members: e, alignment: 4 }) }, Bucket.ElementArrayType = function(e) {
                return new StructArrayType({ members: [{ type: "Uint16", name: "vertices", components: e || 3 }] }) };
        }, { "../util/struct_array": 120, "../util/util": 122, "./array_group": 1, "./bucket/circle_bucket": 3, "./bucket/fill_bucket": 4, "./bucket/fill_extrusion_bucket": 5, "./bucket/line_bucket": 6, "./bucket/symbol_bucket": 7, "./buffer_group": 9 }],
        3: [function(require, module, exports) {
            "use strict";

            function CircleBucket() { Bucket.apply(this, arguments) }
            var Bucket = require("../bucket"),
                util = require("../../util/util"),
                loadGeometry = require("../load_geometry"),
                EXTENT = Bucket.EXTENT;
            module.exports = CircleBucket, CircleBucket.prototype = util.inherit(Bucket, {}), CircleBucket.prototype.addCircleVertex = function(e, t, r, i, a) {
                return e.emplaceBack(2 * t + (i + 1) / 2, 2 * r + (a + 1) / 2) }, CircleBucket.prototype.programInterfaces = { circle: { layoutVertexArrayType: new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }]), elementArrayType: new Bucket.ElementArrayType, paintAttributes: [{ name: "a_color", components: 4, type: "Uint8", getValue: function(e, t, r) {
                            return e.getPaintValue("circle-color", t, r) }, multiplier: 255, paintProperty: "circle-color" }, { name: "a_radius", components: 1, type: "Uint16", isLayerConstant: !1, getValue: function(e, t, r) {
                            return [e.getPaintValue("circle-radius", t, r)] }, multiplier: 10, paintProperty: "circle-radius" }, { name: "a_blur", components: 1, type: "Uint16", isLayerConstant: !1, getValue: function(e, t, r) {
                            return [e.getPaintValue("circle-blur", t, r)] }, multiplier: 10, paintProperty: "circle-blur" }, { name: "a_opacity", components: 1, type: "Uint16", isLayerConstant: !1, getValue: function(e, t, r) {
                            return [e.getPaintValue("circle-opacity", t, r)] }, multiplier: 255, paintProperty: "circle-opacity" }] } }, CircleBucket.prototype.addFeature = function(e) {
                for (var t = { zoom: this.zoom }, r = loadGeometry(e), i = this.prepareArrayGroup("circle", 0), a = i.layoutVertexArray.length, c = 0; c < r.length; c++)
                    for (var l = 0; l < r[c].length; l++) {
                        var n = r[c][l].x,
                            o = r[c][l].y;
                        if (!(n < 0 || n >= EXTENT || o < 0 || o >= EXTENT)) {
                            var u = this.prepareArrayGroup("circle", 4),
                                p = u.layoutVertexArray,
                                y = this.addCircleVertex(p, n, o, -1, -1);
                            this.addCircleVertex(p, n, o, 1, -1), this.addCircleVertex(p, n, o, 1, 1), this.addCircleVertex(p, n, o, -1, 1), u.elementArray.emplaceBack(y, y + 1, y + 2), u.elementArray.emplaceBack(y, y + 3, y + 2) } }
                this.populatePaintArrays("circle", t, e.properties, i, a) };
        }, { "../../util/util": 122, "../bucket": 2, "../load_geometry": 11 }],
        4: [function(require, module, exports) {
            "use strict";

            function FillBucket() { Bucket.apply(this, arguments) }

            function convertCoords(e) {
                return e instanceof Point ? [e.x, e.y] : e.map(convertCoords) }
            var Bucket = require("../bucket"),
                util = require("../../util/util"),
                loadGeometry = require("../load_geometry"),
                earcut = require("earcut"),
                classifyRings = require("../../util/classify_rings"),
                Point = require("point-geometry"),
                EARCUT_MAX_RINGS = 500;
            module.exports = FillBucket, FillBucket.prototype = util.inherit(Bucket, {}), FillBucket.prototype.programInterfaces = { fill: { layoutVertexArrayType: new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }]), elementArrayType: new Bucket.ElementArrayType(1), elementArrayType2: new Bucket.ElementArrayType(2), paintAttributes: [{ name: "a_color", components: 4, type: "Uint8", getValue: function(e, t, r) {
                            return e.getPaintValue("fill-color", t, r) }, multiplier: 255, paintProperty: "fill-color" }, { name: "a_outline_color", components: 4, type: "Uint8", getValue: function(e, t, r) {
                            return e.getPaintValue("fill-outline-color", t, r) }, multiplier: 255, paintProperty: "fill-outline-color" }, { name: "a_opacity", components: 1, type: "Uint8", getValue: function(e, t, r) {
                            return [e.getPaintValue("fill-opacity", t, r)] }, multiplier: 255, paintProperty: "fill-opacity" }] } }, FillBucket.prototype.addVertex = function(e, t, r) {
                return e.emplaceBack(t, r) }, FillBucket.prototype.addFeature = function(e) {
                var t = loadGeometry(e),
                    r = convertCoords(classifyRings(t, EARCUT_MAX_RINGS));
                this.factor = Math.pow(2, 13);
                for (var o = this.prepareArrayGroup("fill", 0), l = o.layoutVertexArray.length, a = 0; a < r.length; a++) this.addPolygon(r[a]);
                this.populatePaintArrays("fill", { zoom: this.zoom }, e.properties, o, l) }, FillBucket.prototype.addPolygon = function(e) {
                for (var t = 0, r = 0; r < e.length; r++) t += e[r].length;
                for (var o = this.prepareArrayGroup("fill", t), l = [], a = [], i = o.layoutVertexArray.length, n = [], u = 0; u < e.length; u++) {
                    var p = e[u];
                    u > 0 && a.push(l.length / 2);
                    for (var c = 0; c < p.length; c++) {
                        var y = p[c],
                            s = this.addVertex(o.layoutVertexArray, y[0], y[1], 0, 0, 1, 1, 0);
                        n.push(s), c >= 1 && o.elementArray2.emplaceBack(s - 1, s), l.push(y[0]), l.push(y[1]) } }
                for (var f = earcut(l, a), m = 0; m < f.length; m++) o.elementArray.emplaceBack(f[m] + i) };
        }, { "../../util/classify_rings": 108, "../../util/util": 122, "../bucket": 2, "../load_geometry": 11, "earcut": 137, "point-geometry": 192 }],
        5: [function(require, module, exports) {
            "use strict";

            function FillExtrusionBucket() { Bucket.apply(this, arguments) }

            function convertCoords(e) {
                return e instanceof Point ? [e.x, e.y] : e.map(convertCoords) }

            function isBoundaryEdge(e, t) {
                return e.some(function(e, r) {
                    return isOutside(t[r]) && t[r] === e }) }

            function isOutside(e) {
                return e < 0 || e > Bucket.EXTENT }
            var Bucket = require("../bucket"),
                util = require("../../util/util"),
                loadGeometry = require("../load_geometry"),
                earcut = require("earcut"),
                classifyRings = require("../../util/classify_rings"),
                Point = require("point-geometry"),
                EARCUT_MAX_RINGS = 500;
            module.exports = FillExtrusionBucket, FillExtrusionBucket.prototype = util.inherit(Bucket, {}), FillExtrusionBucket.prototype.programInterfaces = { fillextrusion: { layoutVertexArrayType: new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }, { name: "a_normal", components: 3, type: "Int16" }, { name: "a_edgedistance", components: 1, type: "Int16" }]), elementArrayType: new Bucket.ElementArrayType(3), paintAttributes: [{ name: "a_minH", components: 1, type: "Uint16", getValue: function(e, t, r) {
                            return [e.getPaintValue("fill-extrude-base", t, r)] }, multiplier: 1, paintProperty: "fill-extrude-base" }, { name: "a_maxH", components: 1, type: "Uint16", getValue: function(e, t, r) {
                            return [e.getPaintValue("fill-extrude-height", t, r)] }, multiplier: 1, paintProperty: "fill-extrude-height" }, { name: "a_color", components: 4, type: "Uint8", getValue: function(e, t, r) {
                            var o = e.getPaintValue("fill-color", t, r);
                            return o[3] = 1, o }, multiplier: 255, paintProperty: "fill-color" }] } }, FillExtrusionBucket.prototype.addVertex = function(e, t, r, o, n, i, a, u) {
                return e.emplaceBack(t, r, 2 * Math.floor(o * this.factor) + a, n * this.factor * 2, i * this.factor * 2, Math.round(u)) }, FillExtrusionBucket.prototype.addFeature = function(e) {
                var t = loadGeometry(e),
                    r = convertCoords(classifyRings(t, EARCUT_MAX_RINGS));
                this.factor = Math.pow(2, 13);
                for (var o = this.prepareArrayGroup("fillextrusion", 0), n = o.layoutVertexArray.length, i = 0; i < r.length; i++) this.addPolygon(r[i]);
                this.populatePaintArrays("fillextrusion", { zoom: this.zoom }, e.properties, o, n) }, FillExtrusionBucket.prototype.addPolygon = function(e) {
                for (var t = 0, r = 0; r < e.length; r++) t += e[r].length;
                t *= 5;
                for (var o = this.prepareArrayGroup("fillextrusion", t), n = [], i = [], a = [], u = 0; u < e.length; u++) {
                    var l = e[u];
                    u > 0 && i.push(n.length / 2);
                    for (var s = 0, p = 0; p < l.length; p++) {
                        var c = l[p],
                            y = this.addVertex(o.layoutVertexArray, c[0], c[1], 0, 0, 1, 1, 0);
                        if (a.push(y), p >= 1) {
                            var d = l[p - 1];
                            if (!isBoundaryEdge(c, d)) {
                                var f = Point.convert(c)._sub(Point.convert(d))._perp()._unit(),
                                    m = this.addVertex(o.layoutVertexArray, c[0], c[1], f.x, f.y, 0, 0, s);
                                this.addVertex(o.layoutVertexArray, c[0], c[1], f.x, f.y, 0, 1, s), s += Point.convert(d).dist(Point.convert(c)), this.addVertex(o.layoutVertexArray, d[0], d[1], f.x, f.y, 0, 0, s), this.addVertex(o.layoutVertexArray, d[0], d[1], f.x, f.y, 0, 1, s), o.elementArray.emplaceBack(m, m + 1, m + 2), o.elementArray.emplaceBack(m + 1, m + 2, m + 3) } }
                        n.push(c[0]), n.push(c[1]) } }
                for (var x = earcut(n, i), h = 0; h < x.length - 2; h += 3) o.elementArray.emplaceBack(a[x[h]], a[x[h + 1]], a[x[h + 2]]) };
        }, { "../../util/classify_rings": 108, "../../util/util": 122, "../bucket": 2, "../load_geometry": 11, "earcut": 137, "point-geometry": 192 }],
        6: [function(require, module, exports) {
            "use strict";

            function LineBucket() { Bucket.apply(this, arguments) }
            var Bucket = require("../bucket"),
                util = require("../../util/util"),
                loadGeometry = require("../load_geometry"),
                EXTENT = Bucket.EXTENT,
                EXTRUDE_SCALE = 63,
                COS_HALF_SHARP_CORNER = Math.cos(37.5 * (Math.PI / 180)),
                SHARP_CORNER_OFFSET = 15,
                LINE_DISTANCE_BUFFER_BITS = 15,
                LINE_DISTANCE_SCALE = .5,
                MAX_LINE_DISTANCE = Math.pow(2, LINE_DISTANCE_BUFFER_BITS - 1) / LINE_DISTANCE_SCALE;
            module.exports = LineBucket, LineBucket.prototype = util.inherit(Bucket, {}), LineBucket.prototype.addLineVertex = function(e, t, i, r, s, a, n) {
                return e.emplaceBack(t.x << 1 | r, t.y << 1 | s, Math.round(EXTRUDE_SCALE * i.x) + 128, Math.round(EXTRUDE_SCALE * i.y) + 128, (0 === a ? 0 : a < 0 ? -1 : 1) + 1 | (n * LINE_DISTANCE_SCALE & 63) << 2, n * LINE_DISTANCE_SCALE >> 6) }, LineBucket.prototype.programInterfaces = { line: { layoutVertexArrayType: new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }, { name: "a_data", components: 4, type: "Uint8" }]), paintAttributes: [{ name: "a_color", components: 4, type: "Uint8", getValue: function(e, t, i) {
                            return e.getPaintValue("line-color", t, i) }, multiplier: 255, paintProperty: "line-color" }], elementArrayType: new Bucket.ElementArrayType } }, LineBucket.prototype.addFeature = function(e) {
                for (var t = loadGeometry(e, LINE_DISTANCE_BUFFER_BITS), i = 0; i < t.length; i++) this.addLine(t[i], e.properties, this.layer.layout["line-join"], this.layer.layout["line-cap"], this.layer.layout["line-miter-limit"], this.layer.layout["line-round-limit"]) }, LineBucket.prototype.addLine = function(e, t, i, r, s, a) {
                for (var n = e.length; n > 2 && e[n - 1].equals(e[n - 2]);) n--;
                if (!(e.length < 2)) { "bevel" === i && (s = 1.05);
                    var u = SHARP_CORNER_OFFSET * (EXTENT / (512 * this.overscaling)),
                        h = e[0],
                        d = e[n - 1],
                        l = h.equals(d),
                        o = this.prepareArrayGroup("line", 10 * n),
                        c = o.layoutVertexArray.length;
                    if (2 !== n || !l) { this.distance = 0;
                        var p, _, y, E, m, x, C, A = r,
                            L = l ? "butt" : r,
                            V = !0;
                        this.e1 = this.e2 = this.e3 = -1, l && (p = e[n - 2], m = h.sub(p)._unit()._perp());
                        for (var f = 0; f < n; f++)
                            if (y = l && f === n - 1 ? e[1] : e[f + 1], !y || !e[f].equals(y)) { m && (E = m), p && (_ = p), p = e[f], m = y ? y.sub(p)._unit()._perp() : E, E = E || m;
                                var S = E.add(m)._unit(),
                                    T = S.x * m.x + S.y * m.y,
                                    v = 1 / T,
                                    B = T < COS_HALF_SHARP_CORNER && _ && y;
                                if (B && f > 0) {
                                    var N = p.dist(_);
                                    if (N > 2 * u) {
                                        var I = p.sub(p.sub(_)._mult(u / N)._round());
                                        this.distance += I.dist(_), this.addCurrentVertex(I, this.distance, E.mult(1), 0, 0, !1), _ = I } }
                                var k = _ && y,
                                    b = k ? i : y ? A : L;
                                if (k && "round" === b && (v < a ? b = "miter" : v <= 2 && (b = "fakeround")), "miter" === b && v > s && (b = "bevel"), "bevel" === b && (v > 2 && (b = "flipbevel"), v < s && (b = "miter")), _ && (this.distance += p.dist(_)), "miter" === b) S._mult(v), this.addCurrentVertex(p, this.distance, S, 0, 0, !1);
                                else if ("flipbevel" === b) {
                                    if (v > 100) S = m.clone();
                                    else {
                                        var R = E.x * m.y - E.y * m.x > 0 ? -1 : 1,
                                            g = v * E.add(m).mag() / E.sub(m).mag();
                                        S._perp()._mult(g * R) }
                                    this.addCurrentVertex(p, this.distance, S, 0, 0, !1), this.addCurrentVertex(p, this.distance, S.mult(-1), 0, 0, !1) } else if ("bevel" === b || "fakeround" === b) {
                                    var F = E.x * m.y - E.y * m.x > 0,
                                        D = -Math.sqrt(v * v - 1);
                                    if (F ? (C = 0, x = D) : (x = 0, C = D), V || this.addCurrentVertex(p, this.distance, E, x, C, !1), "fakeround" === b) {
                                        for (var P, M = Math.floor(8 * (.5 - (T - .5))), q = 0; q < M; q++) P = m.mult((q + 1) / (M + 1))._add(E)._unit(), this.addPieSliceVertex(p, this.distance, P, F);
                                        this.addPieSliceVertex(p, this.distance, S, F);
                                        for (var O = M - 1; O >= 0; O--) P = E.mult((O + 1) / (M + 1))._add(m)._unit(), this.addPieSliceVertex(p, this.distance, P, F) }
                                    y && this.addCurrentVertex(p, this.distance, m, -x, -C, !1) } else "butt" === b ? (V || this.addCurrentVertex(p, this.distance, E, 0, 0, !1), y && this.addCurrentVertex(p, this.distance, m, 0, 0, !1)) : "square" === b ? (V || (this.addCurrentVertex(p, this.distance, E, 1, 1, !1), this.e1 = this.e2 = -1), y && this.addCurrentVertex(p, this.distance, m, -1, -1, !1)) : "round" === b && (V || (this.addCurrentVertex(p, this.distance, E, 0, 0, !1), this.addCurrentVertex(p, this.distance, E, 1, 1, !0), this.e1 = this.e2 = -1), y && (this.addCurrentVertex(p, this.distance, m, -1, -1, !0), this.addCurrentVertex(p, this.distance, m, 0, 0, !1)));
                                if (B && f < n - 1) {
                                    var U = p.dist(y);
                                    if (U > 2 * u) {
                                        var X = p.add(y.sub(p)._mult(u / U)._round());
                                        this.distance += X.dist(p), this.addCurrentVertex(X, this.distance, m.mult(1), 0, 0, !1), p = X } }
                                V = !1 }
                        this.populatePaintArrays("line", { zoom: this.zoom }, t, o, c) } } }, LineBucket.prototype.addCurrentVertex = function(e, t, i, r, s, a) {
                var n, u = a ? 1 : 0,
                    h = this.arrayGroups.line[this.arrayGroups.line.length - 1],
                    d = h.layoutVertexArray,
                    l = h.elementArray;
                n = i.clone(), r && n._sub(i.perp()._mult(r)), this.e3 = this.addLineVertex(d, e, n, u, 0, r, t), this.e1 >= 0 && this.e2 >= 0 && l.emplaceBack(this.e1, this.e2, this.e3), this.e1 = this.e2, this.e2 = this.e3, n = i.mult(-1), s && n._sub(i.perp()._mult(s)), this.e3 = this.addLineVertex(d, e, n, u, 1, -s, t), this.e1 >= 0 && this.e2 >= 0 && l.emplaceBack(this.e1, this.e2, this.e3), this.e1 = this.e2, this.e2 = this.e3, t > MAX_LINE_DISTANCE / 2 && (this.distance = 0, this.addCurrentVertex(e, this.distance, i, r, s, a)) }, LineBucket.prototype.addPieSliceVertex = function(e, t, i, r) {
                var s = r ? 1 : 0;
                i = i.mult(r ? -1 : 1);
                var a = this.arrayGroups.line[this.arrayGroups.line.length - 1],
                    n = a.layoutVertexArray,
                    u = a.elementArray;
                this.e3 = this.addLineVertex(n, e, i, 0, s, 0, t), this.e1 >= 0 && this.e2 >= 0 && u.emplaceBack(this.e1, this.e2, this.e3), r ? this.e2 = this.e3 : this.e1 = this.e3 };
        }, { "../../util/util": 122, "../bucket": 2, "../load_geometry": 11 }],
        7: [function(require, module, exports) {
            "use strict";

            function SymbolBucket(e) { Bucket.apply(this, arguments), this.showCollisionBoxes = e.showCollisionBoxes, this.overscaling = e.overscaling, this.collisionBoxArray = e.collisionBoxArray, this.symbolQuadsArray = e.symbolQuadsArray, this.symbolInstancesArray = e.symbolInstancesArray, this.sdfIcons = e.sdfIcons, this.iconsNeedLinear = e.iconsNeedLinear, this.adjustedTextSize = e.adjustedTextSize, this.adjustedIconSize = e.adjustedIconSize, this.fontstack = e.fontstack }

            function addVertex(e, t, o, a, n, i, s, r, l, y, c) {
                return e.emplaceBack(t, o, Math.round(64 * a), Math.round(64 * n), i / 4, s / 4, 10 * (y || 0), c, 10 * (r || 0), 10 * Math.min(l || 25, 25)) }
            var Point = require("point-geometry"),
                Bucket = require("../bucket"),
                Anchor = require("../../symbol/anchor"),
                getAnchors = require("../../symbol/get_anchors"),
                resolveTokens = require("../../util/token"),
                Quads = require("../../symbol/quads"),
                Shaping = require("../../symbol/shaping"),
                resolveText = require("../../symbol/resolve_text"),
                mergeLines = require("../../symbol/mergelines"),
                clipLine = require("../../symbol/clip_line"),
                util = require("../../util/util"),
                loadGeometry = require("../load_geometry"),
                CollisionFeature = require("../../symbol/collision_feature"),
                findPoleOfInaccessibility = require("../../util/find_pole_of_inaccessibility"),
                classifyRings = require("../../util/classify_rings"),
                shapeText = Shaping.shapeText,
                shapeIcon = Shaping.shapeIcon,
                getGlyphQuads = Quads.getGlyphQuads,
                getIconQuads = Quads.getIconQuads,
                EXTENT = Bucket.EXTENT;
            module.exports = SymbolBucket, SymbolBucket.MAX_QUADS = 65535, SymbolBucket.prototype = util.inherit(Bucket, {}), SymbolBucket.prototype.serialize = function() {
                var e = Bucket.prototype.serialize.apply(this);
                return e.sdfIcons = this.sdfIcons, e.iconsNeedLinear = this.iconsNeedLinear, e.adjustedTextSize = this.adjustedTextSize, e.adjustedIconSize = this.adjustedIconSize, e.fontstack = this.fontstack, e };
            var layoutVertexArrayType = new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }, { name: "a_offset", components: 2, type: "Int16" }, { name: "a_texture_pos", components: 2, type: "Uint16" }, { name: "a_data", components: 4, type: "Uint8" }]),
                elementArrayType = new Bucket.ElementArrayType;
            SymbolBucket.prototype.addCollisionBoxVertex = function(e, t, o, a, n) {
                return e.emplaceBack(t.x, t.y, Math.round(o.x), Math.round(o.y), 10 * a, 10 * n) }, SymbolBucket.prototype.programInterfaces = { glyph: { layoutVertexArrayType: layoutVertexArrayType, elementArrayType: elementArrayType }, icon: { layoutVertexArrayType: layoutVertexArrayType, elementArrayType: elementArrayType }, collisionBox: { layoutVertexArrayType: new Bucket.VertexArrayType([{ name: "a_pos", components: 2, type: "Int16" }, { name: "a_extrude", components: 2, type: "Int16" }, { name: "a_data", components: 2, type: "Uint8" }]) } }, SymbolBucket.prototype.populateArrays = function(e, t, o) {
                var a = { lastIntegerZoom: 1 / 0, lastIntegerZoomTime: 0, lastZoom: 0 };
                this.adjustedTextMaxSize = this.layer.getLayoutValue("text-size", { zoom: 18, zoomHistory: a }), this.adjustedTextSize = this.layer.getLayoutValue("text-size", { zoom: this.zoom + 1, zoomHistory: a }), this.adjustedIconMaxSize = this.layer.getLayoutValue("icon-size", { zoom: 18, zoomHistory: a }), this.adjustedIconSize = this.layer.getLayoutValue("icon-size", { zoom: this.zoom + 1, zoomHistory: a });
                var n = 512 * this.overscaling;
                this.tilePixelRatio = EXTENT / n, this.compareText = {}, this.iconsNeedLinear = !1, this.symbolInstancesStartIndex = this.symbolInstancesArray.length;
                var i = this.layer.layout,
                    s = this.features,
                    r = this.textFeatures,
                    l = .5,
                    y = .5;
                switch (i["text-anchor"]) {
                    case "right":
                    case "top-right":
                    case "bottom-right":
                        l = 1;
                        break;
                    case "left":
                    case "top-left":
                    case "bottom-left":
                        l = 0 }
                switch (i["text-anchor"]) {
                    case "bottom":
                    case "bottom-right":
                    case "bottom-left":
                        y = 1;
                        break;
                    case "top":
                    case "top-right":
                    case "top-left":
                        y = 0 }
                for (var c = "right" === i["text-justify"] ? 1 : "left" === i["text-justify"] ? 0 : .5, h = 24, x = i["text-line-height"] * h, d = "line" !== i["symbol-placement"] ? i["text-max-width"] * h : 0, u = i["text-letter-spacing"] * h, m = [i["text-offset"][0] * h, i["text-offset"][1] * h], p = this.fontstack = i["text-font"].join(","), g = [], b = 0; b < s.length; b++) g.push(loadGeometry(s[b]));
                if ("line" === i["symbol-placement"]) {
                    var I = mergeLines(s, r, g);
                    g = I.geometries, s = I.features, r = I.textFeatures }
                for (var f, S, B = 0; B < s.length; B++)
                    if (g[B]) {
                        if (f = r[B] ? shapeText(r[B], t[p], d, x, l, y, c, u, m) : null, i["icon-image"]) {
                            var v = resolveTokens(s[B].properties, i["icon-image"]),
                                A = o[v];
                            S = shapeIcon(A, i), A && (void 0 === this.sdfIcons ? this.sdfIcons = A.sdf : this.sdfIcons !== A.sdf && util.warnOnce("Style sheet warning: Cannot mix SDF and non-SDF icons in one buffer"), 1 !== A.pixelRatio ? this.iconsNeedLinear = !0 : 0 === i["icon-rotate"] && this.layer.isLayoutValueFeatureConstant("icon-rotate") || (this.iconsNeedLinear = !0)) } else S = null;
                        (f || S) && this.addFeature(g[B], f, S, s[B]) }
                this.symbolInstancesEndIndex = this.symbolInstancesArray.length, this.placeFeatures(e, this.showCollisionBoxes), this.trimArrays() }, SymbolBucket.prototype.addFeature = function(e, t, o, a) {
                var n = this.layer.layout,
                    i = 24,
                    s = this.adjustedTextSize / i,
                    r = void 0 !== this.adjustedTextMaxSize ? this.adjustedTextMaxSize : this.adjustedTextSize,
                    l = this.tilePixelRatio * s,
                    y = this.tilePixelRatio * r / i,
                    c = this.tilePixelRatio * this.adjustedIconSize,
                    h = this.tilePixelRatio * n["symbol-spacing"],
                    x = n["symbol-avoid-edges"],
                    d = n["text-padding"] * this.tilePixelRatio,
                    u = n["icon-padding"] * this.tilePixelRatio,
                    m = n["text-max-angle"] / 180 * Math.PI,
                    p = "map" === n["text-rotation-alignment"] && "line" === n["symbol-placement"],
                    g = "map" === n["icon-rotation-alignment"] && "line" === n["symbol-placement"],
                    b = n["text-allow-overlap"] || n["icon-allow-overlap"] || n["text-ignore-placement"] || n["icon-ignore-placement"],
                    I = n["symbol-placement"],
                    f = "line" === I,
                    S = h / 2,
                    B = null;
                B = f ? clipLine(e, 0, 0, EXTENT, EXTENT) : classifyRings(e, 0);
                for (var v = 0; v < B.length; v++) {
                    var A = null,
                        T = B[v],
                        k = null;
                    f ? (k = T, A = getAnchors(k, h, m, t, o, i, y, this.overscaling, EXTENT)) : (k = T[0], A = this.findPolygonAnchors(T));
                    for (var M = 0, z = A.length; M < z; M++) {
                        var E = A[M];
                        if (!(t && f && this.anchorIsTooClose(t.text, S, E))) {
                            var P = !(E.x < 0 || E.x > EXTENT || E.y < 0 || E.y > EXTENT);
                            if (!x || P) {
                                var w = P || b;
                                this.addSymbolInstance(E, k, t, o, this.layer, w, this.symbolInstancesArray.length, this.collisionBoxArray, a.index, this.sourceLayerIndex, this.index, l, d, p, c, u, g, { zoom: this.zoom }, a.properties) } } } } }, SymbolBucket.prototype.findPolygonAnchors = function(e) {
                var t = e[0];
                if (0 === t.length) return [];
                if (t.length < 3 || !util.isClosedPolygon(t)) return [new Anchor(t[0].x, t[0].y, 0)];
                var o = null,
                    a = findPoleOfInaccessibility(e, 16);
                return o = [new Anchor(a.x, a.y, 0)] }, SymbolBucket.prototype.anchorIsTooClose = function(e, t, o) {
                var a = this.compareText;
                if (e in a) {
                    for (var n = a[e], i = n.length - 1; i >= 0; i--)
                        if (o.dist(n[i]) < t) return !0 } else a[e] = [];
                return a[e].push(o), !1 }, SymbolBucket.prototype.placeFeatures = function(e, t) { this.recalculateStyleLayers(), this.createArrays();
                var o = this.layer.layout,
                    a = e.maxScale,
                    n = "map" === o["text-rotation-alignment"] && "line" === o["symbol-placement"],
                    i = "map" === o["icon-rotation-alignment"] && "line" === o["symbol-placement"],
                    s = o["text-allow-overlap"] || o["icon-allow-overlap"] || o["text-ignore-placement"] || o["icon-ignore-placement"];
                if (s) {
                    var r = this.symbolInstancesArray.toArray(this.symbolInstancesStartIndex, this.symbolInstancesEndIndex),
                        l = e.angle,
                        y = Math.sin(l),
                        c = Math.cos(l);
                    this.sortedSymbolInstances = r.sort(function(e, t) {
                        var o = y * e.anchorPointX + c * e.anchorPointY | 0,
                            a = y * t.anchorPointX + c * t.anchorPointY | 0;
                        return o - a || t.index - e.index }) }
                for (var h = this.symbolInstancesStartIndex; h < this.symbolInstancesEndIndex; h++) {
                    var x = this.sortedSymbolInstances ? this.sortedSymbolInstances[h - this.symbolInstancesStartIndex] : this.symbolInstancesArray.get(h),
                        d = { boxStartIndex: x.textBoxStartIndex, boxEndIndex: x.textBoxEndIndex },
                        u = { boxStartIndex: x.iconBoxStartIndex, boxEndIndex: x.iconBoxEndIndex },
                        m = !(x.textBoxStartIndex === x.textBoxEndIndex),
                        p = !(x.iconBoxStartIndex === x.iconBoxEndIndex),
                        g = o["text-optional"] || !m,
                        b = o["icon-optional"] || !p,
                        I = m ? e.placeCollisionFeature(d, o["text-allow-overlap"], o["symbol-avoid-edges"]) : e.minScale,
                        f = p ? e.placeCollisionFeature(u, o["icon-allow-overlap"], o["symbol-avoid-edges"]) : e.minScale;
                    g || b ? !b && I ? I = Math.max(f, I) : !g && f && (f = Math.max(f, I)) : f = I = Math.max(f, I), m && (e.insertCollisionFeature(d, I, o["text-ignore-placement"]), I <= a && this.addSymbols("glyph", x.glyphQuadStartIndex, x.glyphQuadEndIndex, I, o["text-keep-upright"], n, e.angle)), p && (e.insertCollisionFeature(u, f, o["icon-ignore-placement"]), f <= a && this.addSymbols("icon", x.iconQuadStartIndex, x.iconQuadEndIndex, f, o["icon-keep-upright"], i, e.angle)) }
                t && this.addToDebugBuffers(e) }, SymbolBucket.prototype.addSymbols = function(e, t, o, a, n, i, s) {
                for (var r = this.prepareArrayGroup(e, 4 * (o - t)), l = r.elementArray, y = r.layoutVertexArray, c = this.zoom, h = Math.max(Math.log(a) / Math.LN2 + c, 0), x = t; x < o; x++) {
                    var d = this.symbolQuadsArray.get(x).SymbolQuad,
                        u = (d.anchorAngle + s + Math.PI) % (2 * Math.PI);
                    if (!(n && i && (u <= Math.PI / 2 || u > 3 * Math.PI / 2))) {
                        var m = d.tl,
                            p = d.tr,
                            g = d.bl,
                            b = d.br,
                            I = d.tex,
                            f = d.anchorPoint,
                            S = Math.max(c + Math.log(d.minScale) / Math.LN2, h),
                            B = Math.min(c + Math.log(d.maxScale) / Math.LN2, 25);
                        if (!(B <= S)) { S === h && (S = 0);
                            var v = Math.round(d.glyphAngle / (2 * Math.PI) * 256),
                                A = addVertex(y, f.x, f.y, m.x, m.y, I.x, I.y, S, B, h, v);
                            addVertex(y, f.x, f.y, p.x, p.y, I.x + I.w, I.y, S, B, h, v), addVertex(y, f.x, f.y, g.x, g.y, I.x, I.y + I.h, S, B, h, v), addVertex(y, f.x, f.y, b.x, b.y, I.x + I.w, I.y + I.h, S, B, h, v), l.emplaceBack(A, A + 1, A + 2), l.emplaceBack(A + 1, A + 2, A + 3) } } } }, SymbolBucket.prototype.updateIcons = function(e) { this.recalculateStyleLayers();
                var t = this.layer.layout["icon-image"];
                if (t)
                    for (var o = 0; o < this.features.length; o++) {
                        var a = resolveTokens(this.features[o].properties, t);
                        a && (e[a] = !0) } }, SymbolBucket.prototype.updateFont = function(e) { this.recalculateStyleLayers();
                var t = this.layer.layout["text-font"],
                    o = e[t] = e[t] || {};
                this.textFeatures = resolveText(this.features, this.layer.layout, o) }, SymbolBucket.prototype.addToDebugBuffers = function(e) {
                for (var t = this.prepareArrayGroup("collisionBox", 0), o = t.layoutVertexArray, a = -e.angle, n = e.yStretch, i = this.symbolInstancesStartIndex; i < this.symbolInstancesEndIndex; i++) {
                    var s = this.symbolInstancesArray.get(i);
                    s.textCollisionFeature = { boxStartIndex: s.textBoxStartIndex, boxEndIndex: s.textBoxEndIndex }, s.iconCollisionFeature = { boxStartIndex: s.iconBoxStartIndex, boxEndIndex: s.iconBoxEndIndex };
                    for (var r = 0; r < 2; r++) {
                        var l = s[0 === r ? "textCollisionFeature" : "iconCollisionFeature"];
                        if (l)
                            for (var y = l.boxStartIndex; y < l.boxEndIndex; y++) {
                                var c = this.collisionBoxArray.get(y),
                                    h = c.anchorPoint,
                                    x = new Point(c.x1, c.y1 * n)._rotate(a),
                                    d = new Point(c.x2, c.y1 * n)._rotate(a),
                                    u = new Point(c.x1, c.y2 * n)._rotate(a),
                                    m = new Point(c.x2, c.y2 * n)._rotate(a),
                                    p = Math.max(0, Math.min(25, this.zoom + Math.log(c.maxScale) / Math.LN2)),
                                    g = Math.max(0, Math.min(25, this.zoom + Math.log(c.placementScale) / Math.LN2));
                                this.addCollisionBoxVertex(o, h, x, p, g), this.addCollisionBoxVertex(o, h, d, p, g), this.addCollisionBoxVertex(o, h, d, p, g), this.addCollisionBoxVertex(o, h, m, p, g), this.addCollisionBoxVertex(o, h, m, p, g), this.addCollisionBoxVertex(o, h, u, p, g), this.addCollisionBoxVertex(o, h, u, p, g), this.addCollisionBoxVertex(o, h, x, p, g) } } } }, SymbolBucket.prototype.addSymbolInstance = function(e, t, o, a, n, i, s, r, l, y, c, h, x, d, u, m, p, g, b) {
                var I, f, S, B, v, A, T, k;
                if (o && (T = i ? getGlyphQuads(e, o, h, t, n, d) : [], v = new CollisionFeature(r, t, e, l, y, c, o, h, x, d, !1)), I = this.symbolQuadsArray.length, T && T.length)
                    for (var M = 0; M < T.length; M++) this.addSymbolQuad(T[M]);
                f = this.symbolQuadsArray.length;
                var z = v ? v.boxStartIndex : this.collisionBoxArray.length,
                    E = v ? v.boxEndIndex : this.collisionBoxArray.length;
                a && (k = i ? getIconQuads(e, a, u, t, n, p, o, g, b) : [], A = new CollisionFeature(r, t, e, l, y, c, a, u, m, p, !0)), S = this.symbolQuadsArray.length, k && 1 === k.length && this.addSymbolQuad(k[0]), B = this.symbolQuadsArray.length;
                var P = A ? A.boxStartIndex : this.collisionBoxArray.length,
                    w = A ? A.boxEndIndex : this.collisionBoxArray.length;
                return B > SymbolBucket.MAX_QUADS && util.warnOnce("Too many symbols being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907"), f > SymbolBucket.MAX_QUADS && util.warnOnce("Too many glyphs being rendered in a tile. See https://github.com/mapbox/mapbox-gl-js/issues/2907"), this.symbolInstancesArray.emplaceBack(z, E, P, w, I, f, S, B, e.x, e.y, s) }, SymbolBucket.prototype.addSymbolQuad = function(e) {
                return this.symbolQuadsArray.emplaceBack(e.anchorPoint.x, e.anchorPoint.y, e.tl.x, e.tl.y, e.tr.x, e.tr.y, e.bl.x, e.bl.y, e.br.x, e.br.y, e.tex.h, e.tex.w, e.tex.x, e.tex.y, e.anchorAngle, e.glyphAngle, e.maxScale, e.minScale) };
        }, { "../../symbol/anchor": 69, "../../symbol/clip_line": 71, "../../symbol/collision_feature": 73, "../../symbol/get_anchors": 75, "../../symbol/mergelines": 78, "../../symbol/quads": 79, "../../symbol/resolve_text": 80, "../../symbol/shaping": 81, "../../util/classify_rings": 108, "../../util/find_pole_of_inaccessibility": 114, "../../util/token": 121, "../../util/util": 122, "../bucket": 2, "../load_geometry": 11, "point-geometry": 192 }],
        8: [function(require, module, exports) {
            "use strict";

            function Buffer(t, e, r) { this.arrayBuffer = t.arrayBuffer, this.length = t.length, this.attributes = e.members, this.itemSize = e.bytesPerElement, this.type = r, this.arrayType = e }
            module.exports = Buffer, Buffer.prototype.bind = function(t) {
                var e = t[this.type];
                this.buffer ? t.bindBuffer(e, this.buffer) : (this.gl = t, this.buffer = t.createBuffer(), t.bindBuffer(e, this.buffer), t.bufferData(e, this.arrayBuffer, t.STATIC_DRAW), this.arrayBuffer = null) };
            var AttributeType = { Int8: "BYTE", Uint8: "UNSIGNED_BYTE", Int16: "SHORT", Uint16: "UNSIGNED_SHORT" };
            Buffer.prototype.setVertexAttribPointers = function(t, e) {
                for (var r = 0; r < this.attributes.length; r++) {
                    var f = this.attributes[r],
                        i = e[f.name];
                    void 0 !== i && t.vertexAttribPointer(i, f.components, t[AttributeType[f.type]], !1, this.arrayType.bytesPerElement, f.offset) } }, Buffer.prototype.destroy = function() { this.buffer && this.gl.deleteBuffer(this.buffer) }, Buffer.BufferType = { VERTEX: "ARRAY_BUFFER", ELEMENT: "ELEMENT_ARRAY_BUFFER" };
        }, {}],
        9: [function(require, module, exports) {
            "use strict";

            function BufferGroup(e, r) { this.layoutVertexBuffer = new Buffer(e.layoutVertexArray, r.layoutVertexArrayType, Buffer.BufferType.VERTEX), e.elementArray && (this.elementBuffer = new Buffer(e.elementArray, r.elementArrayType, Buffer.BufferType.ELEMENT));
                var t, f = this.vaos = {};
                e.elementArray2 && (this.elementBuffer2 = new Buffer(e.elementArray2, r.elementArrayType2, Buffer.BufferType.ELEMENT), t = this.secondVaos = {}), this.paintVertexBuffers = util.mapObject(e.paintVertexArrays, function(u, s) {
                    return f[s] = new VertexArrayObject, e.elementArray2 && (t[s] = new VertexArrayObject), new Buffer(u, r.paintVertexArrayTypes[s], Buffer.BufferType.VERTEX) }) }
            var util = require("../util/util"),
                Buffer = require("./buffer"),
                VertexArrayObject = require("../render/vertex_array_object");
            module.exports = BufferGroup, BufferGroup.prototype.destroy = function() { this.layoutVertexBuffer.destroy(), this.elementBuffer && this.elementBuffer.destroy(), this.elementBuffer2 && this.elementBuffer2.destroy();
                for (var e in this.paintVertexBuffers) this.paintVertexBuffers[e].destroy();
                for (var r in this.vaos) this.vaos[r].destroy();
                for (var t in this.secondVaos) this.secondVaos[t].destroy() };
        }, { "../render/vertex_array_object": 34, "../util/util": 122, "./buffer": 8 }],
        10: [function(require, module, exports) {
            "use strict";

            function FeatureIndex(e, t, r) {
                if (e.grid) {
                    var i = e,
                        n = t;
                    e = i.coord, t = i.overscaling, this.grid = new Grid(i.grid), this.featureIndexArray = new FeatureIndexArray(i.featureIndexArray), this.rawTileData = n, this.bucketLayerIDs = i.bucketLayerIDs } else this.grid = new Grid(EXTENT, 16, 0), this.featureIndexArray = new FeatureIndexArray;
                this.coord = e, this.overscaling = t, this.x = e.x, this.y = e.y, this.z = e.z - Math.log(t) / Math.LN2, this.setCollisionTile(r) }

            function translateDistance(e) {
                return Math.sqrt(e[0] * e[0] + e[1] * e[1]) }

            function topDownFeatureComparator(e, t) {
                return t - e }

            function getLineWidth(e) {
                return e["line-gap-width"] > 0 ? e["line-gap-width"] + 2 * e["line-width"] : e["line-width"] }

            function translate(e, t, r, i, n) {
                if (!t[0] && !t[1]) return e;
                t = Point.convert(t), "viewport" === r && t._rotate(-i);
                for (var a = [], o = 0; o < e.length; o++) {
                    for (var s = e[o], l = [], u = 0; u < s.length; u++) l.push(s[u].sub(t._mult(n)));
                    a.push(l) }
                return a }

            function offsetLine(e, t) {
                for (var r = [], i = new Point(0, 0), n = 0; n < e.length; n++) {
                    for (var a = e[n], o = [], s = 0; s < a.length; s++) {
                        var l = a[s - 1],
                            u = a[s],
                            c = a[s + 1],
                            f = 0 === s ? i : u.sub(l)._unit()._perp(),
                            y = s === a.length - 1 ? i : c.sub(u)._unit()._perp(),
                            h = f._add(y)._unit(),
                            d = h.x * y.x + h.y * y.y;
                        h._mult(1 / d), o.push(h._mult(t)._add(u)) }
                    r.push(o) }
                return r }
            var Point = require("point-geometry"),
                loadGeometry = require("./load_geometry"),
                EXTENT = require("./bucket").EXTENT,
                featureFilter = require("feature-filter"),
                StructArrayType = require("../util/struct_array"),
                Grid = require("grid-index"),
                DictionaryCoder = require("../util/dictionary_coder"),
                vt = require("vector-tile"),
                Protobuf = require("pbf"),
                GeoJSONFeature = require("../util/vectortile_to_geojson"),
                arraysIntersect = require("../util/util").arraysIntersect,
                intersection = require("../util/intersection_tests"),
                multiPolygonIntersectsBufferedMultiPoint = intersection.multiPolygonIntersectsBufferedMultiPoint,
                multiPolygonIntersectsMultiPolygon = intersection.multiPolygonIntersectsMultiPolygon,
                multiPolygonIntersectsBufferedMultiLine = intersection.multiPolygonIntersectsBufferedMultiLine,
                FeatureIndexArray = new StructArrayType({ members: [{ type: "Uint32", name: "featureIndex" }, { type: "Uint16", name: "sourceLayerIndex" }, { type: "Uint16", name: "bucketIndex" }] });
            module.exports = FeatureIndex, FeatureIndex.prototype.insert = function(e, t, r, i) {
                var n = this.featureIndexArray.length;
                this.featureIndexArray.emplaceBack(t, r, i);
                for (var a = loadGeometry(e), o = 0; o < a.length; o++) {
                    for (var s = a[o], l = [1 / 0, 1 / 0, -(1 / 0), -(1 / 0)], u = 0; u < s.length; u++) {
                        var c = s[u];
                        l[0] = Math.min(l[0], c.x), l[1] = Math.min(l[1], c.y), l[2] = Math.max(l[2], c.x), l[3] = Math.max(l[3], c.y) }
                    this.grid.insert(n, l[0], l[1], l[2], l[3]) } }, FeatureIndex.prototype.setCollisionTile = function(e) { this.collisionTile = e }, FeatureIndex.prototype.serialize = function() {
                var e = { coord: this.coord, overscaling: this.overscaling, grid: this.grid.toArrayBuffer(), featureIndexArray: this.featureIndexArray.serialize(), bucketLayerIDs: this.bucketLayerIDs };
                return { data: e, transferables: [e.grid, e.featureIndexArray.arrayBuffer] } }, FeatureIndex.prototype.query = function(e, t) { this.vtLayers || (this.vtLayers = new vt.VectorTile(new Protobuf(this.rawTileData)).layers, this.sourceLayerCoder = new DictionaryCoder(this.vtLayers ? Object.keys(this.vtLayers).sort() : ["_geojsonTileLayer"]));
                var r = {},
                    i = e.params || {},
                    n = EXTENT / e.tileSize / e.scale,
                    a = featureFilter(i.filter),
                    o = 0;
                for (var s in t) {
                    var l = t[s],
                        u = l.paint,
                        c = 0; "line" === l.type ? c = getLineWidth(u) / 2 + Math.abs(u["line-offset"]) + translateDistance(u["line-translate"]) : "fill" === l.type ? c = translateDistance(u["fill-translate"]) : "circle" === l.type && (c = u["circle-radius"] + translateDistance(u["circle-translate"])), o = Math.max(o, c * n) }
                for (var f = e.queryGeometry.map(function(e) {
                        return e.map(function(e) {
                            return new Point(e.x, e.y) }) }), y = 1 / 0, h = 1 / 0, d = -(1 / 0), g = -(1 / 0), v = 0; v < f.length; v++)
                    for (var p = f[v], x = 0; x < p.length; x++) {
                        var I = p[x];
                        y = Math.min(y, I.x), h = Math.min(h, I.y), d = Math.max(d, I.x), g = Math.max(g, I.y) }
                var m = this.grid.query(y - o, h - o, d + o, g + o);
                m.sort(topDownFeatureComparator), this.filterMatching(r, m, this.featureIndexArray, f, a, i.layers, t, e.bearing, n);
                var M = this.collisionTile.queryRenderedSymbols(y, h, d, g, e.scale);
                return M.sort(), this.filterMatching(r, M, this.collisionTile.collisionBoxArray, f, a, i.layers, t, e.bearing, n), r }, FeatureIndex.prototype.filterMatching = function(e, t, r, i, n, a, o, s, l) {
                for (var u, c = 0; c < t.length; c++) {
                    var f = t[c];
                    if (f !== u) { u = f;
                        var y = r.get(f),
                            h = this.bucketLayerIDs[y.bucketIndex];
                        if (!a || arraysIntersect(a, h)) {
                            var d = this.sourceLayerCoder.decode(y.sourceLayerIndex),
                                g = this.vtLayers[d],
                                v = g.feature(y.featureIndex);
                            if (n(v))
                                for (var p = null, x = 0; x < h.length; x++) {
                                    var I = h[x];
                                    if (!(a && a.indexOf(I) < 0)) {
                                        var m = o[I];
                                        if (m) {
                                            var M;
                                            if ("symbol" !== m.type) { p || (p = loadGeometry(v));
                                                var L = m.paint;
                                                if ("line" === m.type) { M = translate(i, L["line-translate"], L["line-translate-anchor"], s, l);
                                                    var b = getLineWidth(L) / 2 * l;
                                                    if (L["line-offset"] && (p = offsetLine(p, L["line-offset"] * l)), !multiPolygonIntersectsBufferedMultiLine(M, p, b)) continue } else if ("fill" === m.type) {
                                                    if (M = translate(i, L["fill-translate"], L["fill-translate-anchor"], s, l), !multiPolygonIntersectsMultiPolygon(M, p)) continue } else if ("circle" === m.type) { M = translate(i, L["circle-translate"], L["circle-translate-anchor"], s, l);
                                                    var P = L["circle-radius"] * l;
                                                    if (!multiPolygonIntersectsBufferedMultiPoint(M, p, P)) continue } }
                                            var w = new GeoJSONFeature(v, this.z, this.x, this.y);
                                            w.layer = m.serialize({ includeRefProperties: !0 });
                                            var T = e[I];
                                            void 0 === T && (T = e[I] = []), T.push(w) } } } } } } };
        }, { "../util/dictionary_coder": 110, "../util/intersection_tests": 117, "../util/struct_array": 120, "../util/util": 122, "../util/vectortile_to_geojson": 123, "./bucket": 2, "./load_geometry": 11, "feature-filter": 138, "grid-index": 160, "pbf": 190, "point-geometry": 192, "vector-tile": 202 }],
        11: [function(require, module, exports) {
            "use strict";

            function createBounds(e) {
                return { min: -1 * Math.pow(2, e - 1), max: Math.pow(2, e - 1) - 1 } }
            var util = require("../util/util"),
                EXTENT = require("./bucket").EXTENT,
                boundsLookup = { 15: createBounds(15), 16: createBounds(16) };
            module.exports = function(e, t) {
                for (var r = boundsLookup[t || 16], o = EXTENT / e.extent, u = e.loadGeometry(), n = 0; n < u.length; n++)
                    for (var a = u[n], i = 0; i < a.length; i++) {
                        var d = a[i];
                        d.x = Math.round(d.x * o), d.y = Math.round(d.y * o), (d.x < r.min || d.x > r.max || d.y < r.min || d.y > r.max) && util.warnOnce("Geometry exceeds allowed extent, reduce your vector tile buffer size") }
                return u };
        }, { "../util/util": 122, "./bucket": 2 }],
        12: [function(require, module, exports) {
            "use strict";

            function Coordinate(o, t, n) { this.column = o, this.row = t, this.zoom = n }
            module.exports = Coordinate, Coordinate.prototype = { clone: function() {
                    return new Coordinate(this.column, this.row, this.zoom) }, zoomTo: function(o) {
                    return this.clone()._zoomTo(o) }, sub: function(o) {
                    return this.clone()._sub(o) }, _zoomTo: function(o) {
                    var t = Math.pow(2, o - this.zoom);
                    return this.column *= t, this.row *= t, this.zoom = o, this }, _sub: function(o) {
                    return o = o.zoomTo(this.zoom), this.column -= o.column, this.row -= o.row, this } };
        }, {}],
        13: [function(require, module, exports) {
            "use strict";

            function LngLat(t, n) {
                if (isNaN(t) || isNaN(n)) throw new Error("Invalid LngLat object: (" + t + ", " + n + ")");
                if (this.lng = +t, this.lat = +n, this.lat > 90 || this.lat < -90) throw new Error("Invalid LngLat latitude value: must be between -90 and 90") }
            module.exports = LngLat;
            var wrap = require("../util/util").wrap;
            LngLat.prototype.wrap = function() {
                return new LngLat(wrap(this.lng, -180, 180), this.lat) }, LngLat.prototype.toArray = function() {
                return [this.lng, this.lat] }, LngLat.prototype.toString = function() {
                return "LngLat(" + this.lng + ", " + this.lat + ")" }, LngLat.convert = function(t) {
                if (t instanceof LngLat) return t;
                if (t && t.hasOwnProperty("lng") && t.hasOwnProperty("lat")) return new LngLat(t.lng, t.lat);
                if (Array.isArray(t) && 2 === t.length) return new LngLat(t[0], t[1]);
                throw new Error("`LngLatLike` argument must be specified as a LngLat instance, an object {lng: <lng>, lat: <lat>}, or an array of [<lng>, <lat>]") };
        }, { "../util/util": 122 }],
        14: [function(require, module, exports) {
            "use strict";

            function LngLatBounds(t, n) { t && (n ? this.setSouthWest(t).setNorthEast(n) : 4 === t.length ? this.setSouthWest([t[0], t[1]]).setNorthEast([t[2], t[3]]) : this.setSouthWest(t[0]).setNorthEast(t[1])) }
            module.exports = LngLatBounds;
            var LngLat = require("./lng_lat");
            LngLatBounds.prototype = { setNorthEast: function(t) {
                    return this._ne = LngLat.convert(t), this }, setSouthWest: function(t) {
                    return this._sw = LngLat.convert(t), this }, extend: function(t) {
                    var n, e, s = this._sw,
                        r = this._ne;
                    if (t instanceof LngLat) n = t, e = t;
                    else {
                        if (!(t instanceof LngLatBounds)) return Array.isArray(t) ? t.every(Array.isArray) ? this.extend(LngLatBounds.convert(t)) : this.extend(LngLat.convert(t)) : this;
                        if (n = t._sw, e = t._ne, !n || !e) return this }
                    return s || r ? (s.lng = Math.min(n.lng, s.lng), s.lat = Math.min(n.lat, s.lat), r.lng = Math.max(e.lng, r.lng), r.lat = Math.max(e.lat, r.lat)) : (this._sw = new LngLat(n.lng, n.lat), this._ne = new LngLat(e.lng, e.lat)), this }, getCenter: function() {
                    return new LngLat((this._sw.lng + this._ne.lng) / 2, (this._sw.lat + this._ne.lat) / 2) }, getSouthWest: function() {
                    return this._sw }, getNorthEast: function() {
                    return this._ne }, getNorthWest: function() {
                    return new LngLat(this.getWest(), this.getNorth()) }, getSouthEast: function() {
                    return new LngLat(this.getEast(), this.getSouth()) }, getWest: function() {
                    return this._sw.lng }, getSouth: function() {
                    return this._sw.lat }, getEast: function() {
                    return this._ne.lng }, getNorth: function() {
                    return this._ne.lat }, toArray: function() {
                    return [this._sw.toArray(), this._ne.toArray()] }, toString: function() {
                    return "LngLatBounds(" + this._sw.toString() + ", " + this._ne.toString() + ")" } }, LngLatBounds.convert = function(t) {
                return !t || t instanceof LngLatBounds ? t : new LngLatBounds(t) };
        }, { "./lng_lat": 13 }],
        15: [function(require, module, exports) {
            "use strict";

            function Transform(t, i) { this.tileSize = 512, this._minZoom = t || 0, this._maxZoom = i || 22, this.latRange = [-85.05113, 85.05113], this.width = 0, this.height = 0, this._center = new LngLat(0, 0), this.zoom = 0, this.angle = 0, this._altitude = 1.5, this._pitch = 0, this._unmodified = !0 }
            var LngLat = require("./lng_lat"),
                Point = require("point-geometry"),
                Coordinate = require("./coordinate"),
                util = require("../util/util"),
                interp = require("../util/interpolate"),
                TileCoord = require("../source/tile_coord"),
                EXTENT = require("../data/bucket").EXTENT,
                glmatrix = require("gl-matrix"),
                vec4 = glmatrix.vec4,
                mat4 = glmatrix.mat4,
                mat2 = glmatrix.mat2;
            module.exports = Transform, Transform.prototype = {get minZoom() {
                    return this._minZoom }, set minZoom(t) { this._minZoom !== t && (this._minZoom = t, this.zoom = Math.max(this.zoom, t)) }, get maxZoom() {
                    return this._maxZoom }, set maxZoom(t) { this._maxZoom !== t && (this._maxZoom = t, this.zoom = Math.min(this.zoom, t)) }, get worldSize() {
                    return this.tileSize * this.scale }, get centerPoint() {
                    return this.size._div(2) }, get size() {
                    return new Point(this.width, this.height) }, get bearing() {
                    return -this.angle / Math.PI * 180 }, set bearing(t) {
                    var i = -util.wrap(t, -180, 180) * Math.PI / 180;
                    this.angle !== i && (this._unmodified = !1, this.angle = i, this._calcMatrices(), this.rotationMatrix = mat2.create(), mat2.rotate(this.rotationMatrix, this.rotationMatrix, this.angle)) }, get pitch() {
                    return this._pitch / Math.PI * 180 }, set pitch(t) {
                    var i = util.clamp(t, 0, 60) / 180 * Math.PI;
                    this._pitch !== i && (this._unmodified = !1, this._pitch = i, this._calcMatrices()) }, get altitude() {
                    return this._altitude }, set altitude(t) {
                    var i = Math.max(.75, t);
                    this._altitude !== i && (this._unmodified = !1, this._altitude = i, this._calcMatrices()) }, get zoom() {
                    return this._zoom }, set zoom(t) {
                    var i = Math.min(Math.max(t, this.minZoom), this.maxZoom);
                    this._zoom !== i && (this._unmodified = !1, this._zoom = i, this.scale = this.zoomScale(i), this.tileZoom = Math.floor(i), this.zoomFraction = i - this.tileZoom, this._calcMatrices(), this._constrain()) }, get center() {
                    return this._center }, set center(t) { t.lat === this._center.lat && t.lng === this._center.lng || (this._unmodified = !1, this._center = t, this._calcMatrices(), this._constrain()) }, coveringZoomLevel: function(t) {
                    return (t.roundZoom ? Math.round : Math.floor)(this.zoom + this.scaleZoom(this.tileSize / t.tileSize)) }, coveringTiles: function(t) {
                    var i = this.coveringZoomLevel(t),
                        o = i;
                    if (i < t.minzoom) return [];
                    i > t.maxzoom && (i = t.maxzoom);
                    var e = this,
                        n = e.locationCoordinate(e.center)._zoomTo(i),
                        a = new Point(n.column - .5, n.row - .5);
                    return TileCoord.cover(i, [e.pointCoordinate(new Point(0, 0))._zoomTo(i), e.pointCoordinate(new Point(e.width, 0))._zoomTo(i), e.pointCoordinate(new Point(e.width, e.height))._zoomTo(i), e.pointCoordinate(new Point(0, e.height))._zoomTo(i)], t.reparseOverscaled ? o : i).sort(function(t, i) {
                        return a.dist(t) - a.dist(i) }) }, resize: function(t, i) { this.width = t, this.height = i, this.pixelsToGLUnits = [2 / t, -2 / i], this._calcMatrices(), this._constrain() }, get unmodified() {
                    return this._unmodified }, zoomScale: function(t) {
                    return Math.pow(2, t) }, scaleZoom: function(t) {
                    return Math.log(t) / Math.LN2 }, project: function(t, i) {
                    return new Point(this.lngX(t.lng, i), this.latY(t.lat, i)) }, unproject: function(t, i) {
                    return new LngLat(this.xLng(t.x, i), this.yLat(t.y, i)) }, get x() {
                    return this.lngX(this.center.lng) }, get y() {
                    return this.latY(this.center.lat) }, get point() {
                    return new Point(this.x, this.y) }, lngX: function(t, i) {
                    return (180 + t) * (i || this.worldSize) / 360 }, latY: function(t, i) {
                    var o = 180 / Math.PI * Math.log(Math.tan(Math.PI / 4 + t * Math.PI / 360));
                    return (180 - o) * (i || this.worldSize) / 360 }, xLng: function(t, i) {
                    return 360 * t / (i || this.worldSize) - 180 }, yLat: function(t, i) {
                    var o = 180 - 360 * t / (i || this.worldSize);
                    return 360 / Math.PI * Math.atan(Math.exp(o * Math.PI / 180)) - 90 }, panBy: function(t) {
                    var i = this.centerPoint._add(t);
                    this.center = this.pointLocation(i) }, setLocationAtPoint: function(t, i) {
                    var o = this.locationCoordinate(t),
                        e = this.pointCoordinate(i),
                        n = this.pointCoordinate(this.centerPoint),
                        a = e._sub(o);
                    this._unmodified = !1, this.center = this.coordinateLocation(n._sub(a)) }, locationPoint: function(t) {
                    return this.coordinatePoint(this.locationCoordinate(t)) }, pointLocation: function(t) {
                    return this.coordinateLocation(this.pointCoordinate(t)) }, locationCoordinate: function(t) {
                    var i = this.zoomScale(this.tileZoom) / this.worldSize,
                        o = LngLat.convert(t);
                    return new Coordinate(this.lngX(o.lng) * i, this.latY(o.lat) * i, this.tileZoom) }, coordinateLocation: function(t) {
                    var i = this.zoomScale(t.zoom);
                    return new LngLat(this.xLng(t.column, i), this.yLat(t.row, i)) }, pointCoordinate: function(t) {
                    var i = 0,
                        o = [t.x, t.y, 0, 1],
                        e = [t.x, t.y, 1, 1];
                    vec4.transformMat4(o, o, this.pixelMatrixInverse), vec4.transformMat4(e, e, this.pixelMatrixInverse);
                    var n = o[3],
                        a = e[3],
                        h = o[0] / n,
                        r = e[0] / a,
                        s = o[1] / n,
                        c = e[1] / a,
                        l = o[2] / n,
                        u = e[2] / a,
                        m = l === u ? 0 : (i - l) / (u - l),
                        d = this.worldSize / this.zoomScale(this.tileZoom);
                    return new Coordinate(interp(h, r, m) / d, interp(s, c, m) / d, this.tileZoom) }, coordinatePoint: function(t) {
                    var i = this.worldSize / this.zoomScale(t.zoom),
                        o = [t.column * i, t.row * i, 0, 1];
                    return vec4.transformMat4(o, o, this.pixelMatrix), new Point(o[0] / o[3], o[1] / o[3]) }, calculatePosMatrix: function(t, i) { void 0 === i && (i = 1 / 0), t instanceof TileCoord && (t = t.toCoordinate(i));
                    var o = Math.min(t.zoom, i),
                        e = this.worldSize / Math.pow(2, o),
                        n = new Float64Array(16);
                    return mat4.identity(n), mat4.translate(n, n, [t.column * e, t.row * e, 0]), mat4.scale(n, n, [e / EXTENT, e / EXTENT, 1]), mat4.multiply(n, this.projMatrix, n), new Float32Array(n) }, _constrain: function() {
                    if (this.center && this.width && this.height && !this._constraining) { this._constraining = !0;
                        var t, i, o, e, n, a, h, r, s = this.size,
                            c = this._unmodified;
                        this.latRange && (t = this.latY(this.latRange[1]), i = this.latY(this.latRange[0]), n = i - t < s.y ? s.y / (i - t) : 0), this.lngRange && (o = this.lngX(this.lngRange[0]), e = this.lngX(this.lngRange[1]), a = e - o < s.x ? s.x / (e - o) : 0);
                        var l = Math.max(a || 0, n || 0);
                        if (l) return this.center = this.unproject(new Point(a ? (e + o) / 2 : this.x, n ? (i + t) / 2 : this.y)), this.zoom += this.scaleZoom(l), this._unmodified = c, void(this._constraining = !1);
                        if (this.latRange) {
                            var u = this.y,
                                m = s.y / 2;
                            u - m < t && (r = t + m), u + m > i && (r = i - m) }
                        if (this.lngRange) {
                            var d = this.x,
                                g = s.x / 2;
                            d - g < o && (h = o + g), d + g > e && (h = e - g) }
                        void 0 === h && void 0 === r || (this.center = this.unproject(new Point(void 0 !== h ? h : this.x, void 0 !== r ? r : this.y))), this._unmodified = c, this._constraining = !1 } }, _calcMatrices: function() {
                    if (this.height) {
                        var t = Math.atan(.5 / this.altitude),
                            i = Math.sin(t) * this.altitude / Math.sin(Math.PI / 2 - this._pitch - t),
                            o = Math.cos(Math.PI / 2 - this._pitch) * i + this.altitude,
                            e = new Float64Array(16);
                        if (mat4.perspective(e, 2 * Math.atan(this.height / 2 / this.altitude), this.width / this.height, .1, o), mat4.translate(e, e, [0, 0, -this.altitude]), mat4.scale(e, e, [1, -1, 1 / this.height]), mat4.rotateX(e, e, this._pitch), mat4.rotateZ(e, e, this.angle), mat4.translate(e, e, [-this.x, -this.y, 0]), this.projMatrix = e, e = mat4.create(), mat4.scale(e, e, [this.width / 2, -this.height / 2, 1]), mat4.translate(e, e, [1, -1, 0]), this.pixelMatrix = mat4.multiply(new Float64Array(16), e, this.projMatrix), e = mat4.invert(new Float64Array(16), this.pixelMatrix), !e) throw new Error("failed to invert matrix");
                        this.pixelMatrixInverse = e, e = mat2.create(), mat2.scale(e, e, [1, Math.cos(this._pitch)]), mat2.rotate(e, e, this.angle), this.lineAntialiasingMatrix = e;
                        var n = Math.sqrt(this.height * this.height / 4 * (1 + this.altitude * this.altitude));
                        this.lineStretch = (n + this.height / 2 * Math.tan(this._pitch)) / n - 1 } } };
        }, { "../data/bucket": 2, "../source/tile_coord": 46, "../util/interpolate": 116, "../util/util": 122, "./coordinate": 12, "./lng_lat": 13, "gl-matrix": 150, "point-geometry": 192 }],
        16: [function(require, module, exports) {
            "use strict";
            var WorkerPool = require("./util/worker_pool"),
                globalWorkerPool;
            module.exports = function() {
                return globalWorkerPool || (globalWorkerPool = new WorkerPool), globalWorkerPool };
        }, { "./util/worker_pool": 124 }],
        17: [function(require, module, exports) {
            "use strict";
            var simplexFont = { " ": [16, []], "!": [10, [5, 21, 5, 7, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]], '"': [16, [4, 21, 4, 14, -1, -1, 12, 21, 12, 14]], "#": [21, [11, 25, 4, -7, -1, -1, 17, 25, 10, -7, -1, -1, 4, 12, 18, 12, -1, -1, 3, 6, 17, 6]], $: [20, [8, 25, 8, -4, -1, -1, 12, 25, 12, -4, -1, -1, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]], "%": [24, [21, 21, 3, 0, -1, -1, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, -1, -1, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7]], "&": [26, [23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2]], "'": [10, [5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15]], "(": [14, [11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7]], ")": [14, [3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7]], "*": [16, [8, 21, 8, 9, -1, -1, 3, 18, 13, 12, -1, -1, 13, 18, 3, 12]], "+": [26, [13, 18, 13, 0, -1, -1, 4, 9, 22, 9]], ",": [10, [6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]], "-": [26, [4, 9, 22, 9]], ".": [10, [5, 2, 4, 1, 5, 0, 6, 1, 5, 2]], "/": [22, [20, 25, 2, -7]], 0: [20, [9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21]], 1: [20, [6, 17, 8, 18, 11, 21, 11, 0]], 2: [20, [4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0]], 3: [20, [5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]], 4: [20, [13, 21, 3, 7, 18, 7, -1, -1, 13, 21, 13, 0]], 5: [20, [15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4]], 6: [20, [16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7]], 7: [20, [17, 21, 7, 0, -1, -1, 3, 21, 17, 21]], 8: [20, [8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21]], 9: [20, [16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3]], ":": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2]], ";": [10, [5, 14, 4, 13, 5, 12, 6, 13, 5, 14, -1, -1, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4]], "<": [24, [20, 18, 4, 9, 20, 0]], "=": [26, [4, 12, 22, 12, -1, -1, 4, 6, 22, 6]], ">": [24, [4, 18, 20, 9, 4, 0]], "?": [18, [3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, -1, -1, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2]], "@": [27, [18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, -1, -1, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, -1, -1, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, -1, -1, 19, 16, 18, 8, 18, 6, 19, 5]], A: [18, [9, 21, 1, 0, -1, -1, 9, 21, 17, 0, -1, -1, 4, 7, 14, 7]], B: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, -1, -1, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0]], C: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5]], D: [21, [4, 21, 4, 0, -1, -1, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0]], E: [19, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11, -1, -1, 4, 0, 17, 0]], F: [18, [4, 21, 4, 0, -1, -1, 4, 21, 17, 21, -1, -1, 4, 11, 12, 11]], G: [21, [18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, -1, -1, 13, 8, 18, 8]], H: [22, [4, 21, 4, 0, -1, -1, 18, 21, 18, 0, -1, -1, 4, 11, 18, 11]], I: [8, [4, 21, 4, 0]], J: [16, [12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7]], K: [21, [4, 21, 4, 0, -1, -1, 18, 21, 4, 7, -1, -1, 9, 12, 18, 0]], L: [17, [4, 21, 4, 0, -1, -1, 4, 0, 16, 0]], M: [24, [4, 21, 4, 0, -1, -1, 4, 21, 12, 0, -1, -1, 20, 21, 12, 0, -1, -1, 20, 21, 20, 0]], N: [22, [4, 21, 4, 0, -1, -1, 4, 21, 18, 0, -1, -1, 18, 21, 18, 0]], O: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21]], P: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10]], Q: [22, [9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, -1, -1, 12, 4, 18, -2]], R: [21, [4, 21, 4, 0, -1, -1, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, -1, -1, 11, 11, 18, 0]], S: [20, [17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3]], T: [16, [8, 21, 8, 0, -1, -1, 1, 21, 15, 21]], U: [22, [4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21]], V: [18, [1, 21, 9, 0, -1, -1, 17, 21, 9, 0]], W: [24, [2, 21, 7, 0, -1, -1, 12, 21, 7, 0, -1, -1, 12, 21, 17, 0, -1, -1, 22, 21, 17, 0]], X: [20, [3, 21, 17, 0, -1, -1, 17, 21, 3, 0]], Y: [18, [1, 21, 9, 11, 9, 0, -1, -1, 17, 21, 9, 11]], Z: [20, [17, 21, 3, 0, -1, -1, 3, 21, 17, 21, -1, -1, 3, 0, 17, 0]], "[": [14, [4, 25, 4, -7, -1, -1, 5, 25, 5, -7, -1, -1, 4, 25, 11, 25, -1, -1, 4, -7, 11, -7]], "\\": [14, [0, 21, 14, -3]], "]": [14, [9, 25, 9, -7, -1, -1, 10, 25, 10, -7, -1, -1, 3, 25, 10, 25, -1, -1, 3, -7, 10, -7]], "^": [16, [6, 15, 8, 18, 10, 15, -1, -1, 3, 12, 8, 17, 13, 12, -1, -1, 8, 17, 8, 0]], _: [16, [0, -2, 16, -2]], "`": [10, [6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17]], a: [19, [15, 14, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], b: [19, [4, 21, 4, 0, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]], c: [18, [15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], d: [19, [15, 21, 15, 0, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], e: [18, [3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], f: [12, [10, 21, 8, 21, 6, 20, 5, 17, 5, 0, -1, -1, 2, 14, 9, 14]], g: [19, [15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], h: [19, [4, 21, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]], i: [8, [3, 21, 4, 20, 5, 21, 4, 22, 3, 21, -1, -1, 4, 14, 4, 0]], j: [10, [5, 21, 6, 20, 7, 21, 6, 22, 5, 21, -1, -1, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7]], k: [17, [4, 21, 4, 0, -1, -1, 14, 14, 4, 4, -1, -1, 8, 8, 15, 0]], l: [8, [4, 21, 4, 0]], m: [30, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, -1, -1, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0]], n: [19, [4, 14, 4, 0, -1, -1, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0]], o: [19, [8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14]], p: [19, [4, 14, 4, -7, -1, -1, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3]], q: [19, [15, 14, 15, -7, -1, -1, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3]], r: [13, [4, 14, 4, 0, -1, -1, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14]], s: [17, [14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3]], t: [12, [5, 21, 5, 4, 6, 1, 8, 0, 10, 0, -1, -1, 2, 14, 9, 14]], u: [19, [4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, -1, -1, 15, 14, 15, 0]], v: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0]], w: [22, [3, 14, 7, 0, -1, -1, 11, 14, 7, 0, -1, -1, 11, 14, 15, 0, -1, -1, 19, 14, 15, 0]], x: [17, [3, 14, 14, 0, -1, -1, 14, 14, 3, 0]], y: [16, [2, 14, 8, 0, -1, -1, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7]], z: [17, [14, 14, 3, 0, -1, -1, 3, 14, 14, 14, -1, -1, 3, 0, 14, 0]], "{": [14, [9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, -1, -1, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, -1, -1, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7]], "|": [8, [4, 25, 4, -7]], "}": [14, [5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, -1, -1, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, -1, -1, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7]], "~": [24, [3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, -1, -1, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]] };
            module.exports = function(l, n, t, e) { e = e || 1;
                var r, o, u, s, i, x, f, p, h = [];
                for (r = 0, o = l.length; r < o; r++)
                    if (i = simplexFont[l[r]]) {
                        for (p = null, u = 0, s = i[1].length; u < s; u += 2) i[1][u] === -1 && i[1][u + 1] === -1 ? p = null : (x = n + i[1][u] * e, f = t - i[1][u + 1] * e, p && h.push(p.x, p.y, x, f), p = { x: x, y: f });
                        n += i[0] * e }
                return h };
        }, {}],
        18: [function(require, module, exports) {
            "use strict";
            var browser = require("./util/browser"),
                mapboxgl = module.exports = {};
            mapboxgl.version = require("../package.json").version, mapboxgl.workerCount = Math.max(browser.hardwareConcurrency - 1, 1), mapboxgl.Map = require("./ui/map"), mapboxgl.Control = require("./ui/control/control"), mapboxgl.NavigationControl = require("./ui/control/navigation_control"), mapboxgl.GeolocateControl = require("./ui/control/geolocate_control"), mapboxgl.AttributionControl = require("./ui/control/attribution_control"), mapboxgl.ScaleControl = require("./ui/control/scale_control"), mapboxgl.Popup = require("./ui/popup"), mapboxgl.Marker = require("./ui/marker"), mapboxgl.Style = require("./style/style"), mapboxgl.LngLat = require("./geo/lng_lat"), mapboxgl.LngLatBounds = require("./geo/lng_lat_bounds"), mapboxgl.Point = require("point-geometry"), mapboxgl.Evented = require("./util/evented"), mapboxgl.util = require("./util/util"), mapboxgl.supported = require("./util/browser").supported;
            var ajax = require("./util/ajax");
            mapboxgl.util.getJSON = ajax.getJSON, mapboxgl.util.getArrayBuffer = ajax.getArrayBuffer;
            var config = require("./util/config");
            mapboxgl.config = config, Object.defineProperty(mapboxgl, "accessToken", { get: function() {
                    return config.ACCESS_TOKEN }, set: function(o) { config.ACCESS_TOKEN = o } });
        }, { "../package.json": 211, "./geo/lng_lat": 13, "./geo/lng_lat_bounds": 14, "./style/style": 56, "./ui/control/attribution_control": 87, "./ui/control/control": 88, "./ui/control/geolocate_control": 89, "./ui/control/navigation_control": 90, "./ui/control/scale_control": 91, "./ui/map": 100, "./ui/marker": 101, "./ui/popup": 102, "./util/ajax": 104, "./util/browser": 105, "./util/config": 109, "./util/evented": 113, "./util/util": 122, "point-geometry": 192 }],
        19: [function(require, module, exports) {
            "use strict";
            module.exports = function(e) {
                for (var n = { define: {}, initialize: {} }, i = 0; i < e.length; i++) {
                    var o = e[i],
                        t = "{precision} " + (1 === o.components ? "float" : "vec" + o.components);
                    n.define[o.name.slice(2)] = "uniform " + t + " " + o.name + ";\n", n.initialize[o.name.slice(2)] = t + " " + o.name.slice(2) + " = " + o.name + ";\n" }
                return n };
        }, {}],
        20: [function(require, module, exports) {
            "use strict";

            function drawBackground(r, e, t) {
                var i, o = r.gl,
                    a = r.transform,
                    n = t.paint["background-color"],
                    u = t.paint["background-pattern"],
                    l = t.paint["background-opacity"],
                    f = u ? r.spriteAtlas.getPosition(u.from, !0) : null,
                    s = u ? r.spriteAtlas.getPosition(u.to, !0) : null;
                if (r.setDepthSublayer(0), f && s) {
                    if (r.isOpaquePass) return;
                    i = r.useProgram("fillPattern"), o.uniform1i(i.u_image, 0), o.uniform2fv(i.u_pattern_tl_a, f.tl), o.uniform2fv(i.u_pattern_br_a, f.br), o.uniform2fv(i.u_pattern_tl_b, s.tl), o.uniform2fv(i.u_pattern_br_b, s.br), o.uniform1f(i.u_opacity, l), o.uniform1f(i.u_mix, u.t), o.uniform2fv(i.u_pattern_size_a, f.size), o.uniform2fv(i.u_pattern_size_b, s.size), o.uniform1f(i.u_scale_a, u.fromScale), o.uniform1f(i.u_scale_b, u.toScale), o.activeTexture(o.TEXTURE0), r.spriteAtlas.bind(o, !0), r.tileExtentPatternVAO.bind(o, i, r.tileExtentBuffer) } else {
                    if (r.isOpaquePass !== (1 === n[3])) return;
                    var _ = createUniformPragmas([{ name: "u_color", components: 4 }, { name: "u_opacity", components: 1 }]);
                    i = r.useProgram("fill", [], _, _), o.uniform4fv(i.u_color, n), o.uniform1f(i.u_opacity, l), r.tileExtentVAO.bind(o, i, r.tileExtentBuffer) }
                o.disable(o.STENCIL_TEST);
                for (var m = a.coveringTiles({ tileSize: tileSize }), c = 0; c < m.length; c++) {
                    var p = m[c];
                    if (f && s) {
                        var d = { coord: p, tileSize: tileSize };
                        o.uniform1f(i.u_tile_units_to_pixels, 1 / pixelsToTileUnits(d, 1, r.transform.tileZoom));
                        var x = d.tileSize * Math.pow(2, r.transform.tileZoom - d.coord.z),
                            g = x * (d.coord.x + p.w * Math.pow(2, d.coord.z)),
                            v = x * d.coord.y;
                        o.uniform2f(i.u_pixel_coord_upper, g >> 16, v >> 16), o.uniform2f(i.u_pixel_coord_lower, 65535 & g, 65535 & v) }
                    o.uniformMatrix4fv(i.u_matrix, !1, r.transform.calculatePosMatrix(p)), o.drawArrays(o.TRIANGLE_STRIP, 0, r.tileExtentBuffer.length) }
                o.stencilMask(0), o.stencilFunc(o.EQUAL, 128, 128) }
            var pixelsToTileUnits = require("../source/pixels_to_tile_units"),
                createUniformPragmas = require("./create_uniform_pragmas"),
                tileSize = 512;
            module.exports = drawBackground;
        }, { "../source/pixels_to_tile_units": 40, "./create_uniform_pragmas": 19 }],
        21: [function(require, module, exports) {
            "use strict";

            function drawCircles(e, r, t, i) {
                if (!e.isOpaquePass) {
                    var a = e.gl;
                    e.setDepthSublayer(0), e.depthMask(!1), a.disable(a.STENCIL_TEST);
                    for (var s = 0; s < i.length; s++) {
                        var l = i[s],
                            o = r.getTile(l),
                            n = o.getBucket(t);
                        if (n) {
                            var f = n.bufferGroups.circle;
                            if (f) {
                                var u = n.paintAttributes.circle[t.id],
                                    c = e.useProgram("circle", u.defines, u.vertexPragmas, u.fragmentPragmas); "map" === t.paint["circle-pitch-scale"] ? (a.uniform1i(c.u_scale_with_map, !0), a.uniform2f(c.u_extrude_scale, e.transform.pixelsToGLUnits[0] * e.transform.altitude, e.transform.pixelsToGLUnits[1] * e.transform.altitude)) : (a.uniform1i(c.u_scale_with_map, !1), a.uniform2fv(c.u_extrude_scale, e.transform.pixelsToGLUnits)), a.uniform1f(c.u_devicepixelratio, browser.devicePixelRatio), a.uniformMatrix4fv(c.u_matrix, !1, e.translatePosMatrix(l.posMatrix, o, t.paint["circle-translate"], t.paint["circle-translate-anchor"])), n.setUniforms(a, "circle", c, t, { zoom: e.transform.zoom });
                                for (var m = 0; m < f.length; m++) {
                                    var p = f[m];
                                    p.vaos[t.id].bind(a, c, p.layoutVertexBuffer, p.elementBuffer, p.paintVertexBuffers[t.id]), a.drawElements(a.TRIANGLES, 3 * p.elementBuffer.length, a.UNSIGNED_SHORT, 0) } } } } } }
            var browser = require("../util/browser");
            module.exports = drawCircles;
        }, { "../util/browser": 105 }],
        22: [function(require, module, exports) {
            "use strict";

            function drawCollisionDebug(o, r, e, i) {
                var a = o.gl;
                a.enable(a.STENCIL_TEST);
                for (var l = o.useProgram("collisionBox"), t = 0; t < i.length; t++) {
                    var u = i[t],
                        f = r.getTile(u),
                        n = f.getBucket(e);
                    if (n) {
                        var s = n.bufferGroups.collisionBox;
                        if (s && s.length) {
                            var m = s[0];
                            0 !== m.layoutVertexBuffer.length && (a.uniformMatrix4fv(l.u_matrix, !1, u.posMatrix), o.enableTileClippingMask(u), o.lineWidth(1), a.uniform1f(l.u_scale, Math.pow(2, o.transform.zoom - f.coord.z)), a.uniform1f(l.u_zoom, 10 * o.transform.zoom), a.uniform1f(l.u_maxzoom, 10 * (f.coord.z + 1)), m.vaos[e.id].bind(a, l, m.layoutVertexBuffer), a.drawArrays(a.LINES, 0, m.layoutVertexBuffer.length)) } } } }
            module.exports = drawCollisionDebug;
        }, {}],
        23: [function(require, module, exports) {
            "use strict";

            function drawDebug(r, e, a) {
                if (!r.isOpaquePass && r.options.debug)
                    for (var t = 0; t < a.length; t++) drawDebugTile(r, e, a[t]) }

            function drawDebugTile(r, e, a) {
                var t = r.gl;
                t.disable(t.STENCIL_TEST), r.lineWidth(1 * browser.devicePixelRatio);
                var i = a.posMatrix,
                    u = r.useProgram("debug");
                t.uniformMatrix4fv(u.u_matrix, !1, i), t.uniform4f(u.u_color, 1, 0, 0, 1), r.debugVAO.bind(t, u, r.debugBuffer), t.drawArrays(t.LINE_STRIP, 0, r.debugBuffer.length);
                for (var o = textVertices(a.toString(), 50, 200, 5), f = new r.PosArray, n = 0; n < o.length; n += 2) f.emplaceBack(o[n], o[n + 1]);
                var l = new Buffer(f.serialize(), r.PosArray.serialize(), Buffer.BufferType.VERTEX),
                    s = new VertexArrayObject;
                s.bind(t, u, l), t.uniform4f(u.u_color, 1, 1, 1, 1);
                for (var b = e.getTile(a).tileSize, d = EXTENT / (Math.pow(2, r.transform.zoom - a.z) * b), g = [
                        [-1, -1],
                        [-1, 1],
                        [1, -1],
                        [1, 1]
                    ], m = 0; m < g.length; m++) {
                    var x = g[m];
                    t.uniformMatrix4fv(u.u_matrix, !1, mat4.translate([], i, [d * x[0], d * x[1], 0])), t.drawArrays(t.LINES, 0, l.length) }
                t.uniform4f(u.u_color, 0, 0, 0, 1), t.uniformMatrix4fv(u.u_matrix, !1, i), t.drawArrays(t.LINES, 0, l.length) }
            var textVertices = require("../lib/debugtext"),
                browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                EXTENT = require("../data/bucket").EXTENT,
                Buffer = require("../data/buffer"),
                VertexArrayObject = require("./vertex_array_object");
            module.exports = drawDebug;
        }, { "../data/bucket": 2, "../data/buffer": 8, "../lib/debugtext": 17, "../util/browser": 105, "./vertex_array_object": 34, "gl-matrix": 150 }],
        24: [function(require, module, exports) {
            "use strict";

            function draw(e, t, r, i) {
                if (0 !== r.paint["fill-opacity"]) {
                    var a = e.gl;
                    a.disable(a.STENCIL_TEST), e.depthMask(!0);
                    var s = new ExtrusionTexture(a, e, r);
                    s.bindFramebuffer(), a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT);
                    for (var u = 0; u < i.length; u++) drawExtrusion(e, t, r, i[u]);
                    s.unbindFramebuffer(), s.renderToMap() } }

            function ExtrusionTexture(e, t, r) { this.gl = e, this.width = t.width, this.height = t.height, this.painter = t, this.layer = r, this.texture = null, this.fbo = null, this.fbos = this.painter.preFbos[this.width] && this.painter.preFbos[this.width][this.height] }

            function drawExtrusion(e, t, r, i) {
                var a = t.getTile(i),
                    s = a.getBucket(r);
                if (s) {
                    var u = s.bufferGroups.fillextrusion;
                    if (u && !e.isOpaquePass) {
                        var f = e.gl,
                            n = r.paint["fill-pattern"],
                            h = s.paintAttributes.fillextrusion[r.id],
                            o = e.useProgram(n ? "fillExtrudePattern" : "fillExtrude", h.defines, h.vertexPragmas, h.fragmentPragmas);
                        n && setPattern(n, a, i, e, o, !0), setMatrix(o, e, i, a, r), setLight(o, e), s.setUniforms(f, "fillextrusion", o, r, { zoom: e.transform.zoom });
                        for (var E = 0; E < u.length; E++) {
                            var T = u[E];
                            T.vaos[r.id].bind(f, o, T.layoutVertexBuffer, T.elementBuffer, T.paintVertexBuffers[r.id]), f.drawElements(f.TRIANGLES, 3 * T.elementBuffer.length, f.UNSIGNED_SHORT, 0) } } } }

            function setMatrix(e, t, r, i, a) {
                var s = Math.pow(2, t.transform.zoom) / 5e4;
                t.gl.uniformMatrix4fv(e.u_matrix, !1, mat4.scale(mat4.create(), t.translatePosMatrix(r.posMatrix, i, a.paint["fill-translate"], a.paint["fill-translate-anchor"]), [1, 1, s, 1])) }

            function setLight(e, t) {
                var r = t.gl,
                    i = t.style.light,
                    a = i.calculated.position,
                    s = [a.x, a.y, a.z],
                    u = mat3.create(); "viewport" === i.calculated.anchor && mat3.fromRotation(u, -t.transform.angle), vec3.transformMat3(s, s, u), r.uniform3fv(e.u_lightpos, s), r.uniform1f(e.u_lightintensity, i.calculated.intensity), r.uniform3fv(e.u_lightcolor, i.calculated.color.slice(0, 3)) }
            var mat3 = require("gl-matrix").mat3,
                mat4 = require("gl-matrix").mat4,
                vec3 = require("gl-matrix").vec3,
                Buffer = require("../data/buffer"),
                VertexArrayObject = require("./vertex_array_object"),
                StructArrayType = require("../util/struct_array"),
                setPattern = require("./set_pattern");
            module.exports = draw, ExtrusionTexture.prototype.bindFramebuffer = function() {
                var e = this.gl;
                if (this.texture = this.painter.getViewportTexture(this.width, this.height), e.activeTexture(e.TEXTURE1), this.texture ? e.bindTexture(e.TEXTURE_2D, this.texture) : (this.texture = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this.texture), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, this.width, this.height, 0, e.RGBA, e.UNSIGNED_BYTE, null), this.texture.width = this.width, this.texture.height = this.height), this.fbos) this.fbo = this.fbos.pop(), e.bindFramebuffer(e.FRAMEBUFFER, this.fbo), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.texture, 0);
                else { this.fbo = e.createFramebuffer();
                    var t = e.createRenderbuffer(),
                        r = e.createRenderbuffer();
                    e.bindRenderbuffer(e.RENDERBUFFER, t), e.bindRenderbuffer(e.RENDERBUFFER, r), e.renderbufferStorage(e.RENDERBUFFER, e.RGBA4, this.width, this.height), e.renderbufferStorage(e.RENDERBUFFER, e.DEPTH_COMPONENT16, this.width, this.height), e.bindFramebuffer(e.FRAMEBUFFER, this.fbo), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.RENDERBUFFER, t), e.framebufferRenderbuffer(e.FRAMEBUFFER, e.DEPTH_ATTACHMENT, e.RENDERBUFFER, r), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, this.texture, 0) } }, ExtrusionTexture.prototype.unbindFramebuffer = function() { this.painter.bindDefaultFramebuffer(), this.fbos ? this.fbos.push(this.fbo) : (this.painter.preFbos[this.width] || (this.painter.preFbos[this.width] = {}), this.painter.preFbos[this.width][this.height] = [this.fbo]), this.painter.saveViewportTexture(this.texture) }, ExtrusionTexture.prototype.TextureBoundsArray = new StructArrayType({ members: [{ name: "a_pos", type: "Int16", components: 2 }] }), ExtrusionTexture.prototype.renderToMap = function() {
                var e = this.gl,
                    t = this.painter,
                    r = t.useProgram("fillExtrudeTexture");
                e.activeTexture(e.TEXTURE0), e.bindTexture(e.TEXTURE_2D, this.texture), e.uniform1f(r.u_opacity, this.layer.paint["fill-opacity"]), e.uniform1i(r.u_texture, 1), e.uniformMatrix4fv(r.u_matrix, !1, mat4.ortho(mat4.create(), 0, t.width, t.height, 0, 0, 1)), e.disable(e.DEPTH_TEST), e.uniform1i(r.u_xdim, t.width), e.uniform1i(r.u_ydim, t.height);
                var i = new this.TextureBoundsArray;
                i.emplaceBack(0, 0), i.emplaceBack(t.width, 0), i.emplaceBack(0, t.height), i.emplaceBack(t.width, t.height);
                var a = new Buffer(i.serialize(), this.TextureBoundsArray.serialize(), Buffer.BufferType.VERTEX),
                    s = new VertexArrayObject;
                s.bind(e, r, a), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.enable(e.DEPTH_TEST) };
        }, { "../data/buffer": 8, "../util/struct_array": 120, "./set_pattern": 33, "./vertex_array_object": 34, "gl-matrix": 150 }],
        25: [function(require, module, exports) {
            "use strict";

            function draw(t, e, r, a) {
                var i = t.gl;
                i.enable(i.STENCIL_TEST);
                var l = !r.paint["fill-pattern"] && r.isPaintValueFeatureConstant("fill-color") && r.isPaintValueFeatureConstant("fill-opacity") && 1 === r.paint["fill-color"][3] && 1 === r.paint["fill-opacity"];
                if (t.isOpaquePass === l) { t.setDepthSublayer(1);
                    for (var n = 0; n < a.length; n++) drawFill(t, e, r, a[n]) }
                if (!t.isOpaquePass && r.paint["fill-antialias"]) { t.lineWidth(2), t.depthMask(!1), t.setDepthSublayer(r.getPaintProperty("fill-outline-color") ? 2 : 0);
                    for (var f = 0; f < a.length; f++) drawStroke(t, e, r, a[f]) } }

            function drawFill(t, e, r, a) {
                var i = e.getTile(a),
                    l = i.getBucket(r);
                if (l) {
                    var n = l.bufferGroups.fill;
                    if (n) {
                        var f, o = t.gl,
                            s = r.paint["fill-pattern"];
                        if (s) f = t.useProgram("fillPattern"), setPattern(s, i, a, t, f, !1), o.uniform1f(f.u_opacity, r.paint["fill-opacity"]), o.activeTexture(o.TEXTURE0), t.spriteAtlas.bind(o, !0);
                        else {
                            var u = l.paintAttributes.fill[r.id];
                            f = t.useProgram("fill", u.defines, u.vertexPragmas, u.fragmentPragmas), l.setUniforms(o, "fill", f, r, { zoom: t.transform.zoom }) }
                        o.uniformMatrix4fv(f.u_matrix, !1, t.translatePosMatrix(a.posMatrix, i, r.paint["fill-translate"], r.paint["fill-translate-anchor"])), t.enableTileClippingMask(a);
                        for (var p = 0; p < n.length; p++) {
                            var g = n[p];
                            g.vaos[r.id].bind(o, f, g.layoutVertexBuffer, g.elementBuffer, g.paintVertexBuffers[r.id]), o.drawElements(o.TRIANGLES, g.elementBuffer.length, o.UNSIGNED_SHORT, 0) } } } }

            function drawStroke(t, e, r, a) {
                var i = e.getTile(a),
                    l = i.getBucket(r);
                if (l) {
                    var n = l.bufferGroups.fill;
                    if (n) {
                        var f, o = t.gl,
                            s = r.paint["fill-pattern"],
                            u = r.getPaintProperty("fill-outline-color");
                        if (s && !u) f = t.useProgram("fillOutlinePattern"), o.uniform2f(f.u_world, o.drawingBufferWidth, o.drawingBufferHeight);
                        else {
                            var p = l.paintAttributes.fill[r.id];
                            f = t.useProgram("fillOutline", p.defines, p.vertexPragmas, p.fragmentPragmas), o.uniform2f(f.u_world, o.drawingBufferWidth, o.drawingBufferHeight), l.setUniforms(o, "fill", f, r, { zoom: t.transform.zoom }) }
                        o.uniform1f(f.u_opacity, r.paint["fill-opacity"]), o.uniformMatrix4fv(f.u_matrix, !1, t.translatePosMatrix(a.posMatrix, i, r.paint["fill-translate"], r.paint["fill-translate-anchor"])), s && setPattern(s, i, a, t, f, !1), t.enableTileClippingMask(a);
                        for (var g = 0; g < n.length; g++) {
                            var m = n[g];
                            m.secondVaos[r.id].bind(o, f, m.layoutVertexBuffer, m.elementBuffer2, m.paintVertexBuffers[r.id]), o.drawElements(o.LINES, 2 * m.elementBuffer2.length, o.UNSIGNED_SHORT, 0) } } } }
            var setPattern = require("./set_pattern");
            module.exports = draw;
        }, { "./set_pattern": 33 }],
        26: [function(require, module, exports) {
            "use strict";

            function drawLineTile(i, e, t, r) {
                var n = e.getTile(r),
                    a = n.getBucket(t);
                if (a) {
                    var o = a.bufferGroups.line;
                    if (o) {
                        var l = i.gl,
                            f = t.paint["line-dasharray"],
                            s = t.paint["line-pattern"],
                            u = a.paintAttributes.line[t.id],
                            m = i.useProgram(f ? "lineSDF" : s ? "linePattern" : "line", u.defines, u.vertexPragmas, u.fragmentPragmas);
                        s || l.uniform4fv(m.u_color, t.paint["line-color"]);
                        var _, p, v, d;
                        if (f) _ = i.lineAtlas.getDash(f.from, "round" === t.layout["line-cap"]), p = i.lineAtlas.getDash(f.to, "round" === t.layout["line-cap"]), l.uniform1i(m.u_image, 0), l.activeTexture(l.TEXTURE0), i.lineAtlas.bind(l), l.uniform1f(m.u_tex_y_a, _.y), l.uniform1f(m.u_tex_y_b, p.y), l.uniform1f(m.u_mix, f.t);
                        else if (s) {
                            if (v = i.spriteAtlas.getPosition(s.from, !0), d = i.spriteAtlas.getPosition(s.to, !0), !v || !d) return;
                            l.uniform1i(m.u_image, 0), l.activeTexture(l.TEXTURE0), i.spriteAtlas.bind(l, !0), l.uniform2fv(m.u_pattern_tl_a, v.tl), l.uniform2fv(m.u_pattern_br_a, v.br), l.uniform2fv(m.u_pattern_tl_b, d.tl), l.uniform2fv(m.u_pattern_br_b, d.br), l.uniform1f(m.u_fade, s.t) }
                        var T = 1 / browser.devicePixelRatio;
                        l.uniform1f(m.u_linewidth, t.paint["line-width"] / 2), l.uniform1f(m.u_gapwidth, t.paint["line-gap-width"] / 2), l.uniform1f(m.u_antialiasing, T / 2), l.uniform1f(m.u_blur, t.paint["line-blur"] + T), l.uniform1f(m.u_opacity, t.paint["line-opacity"]), l.uniformMatrix2fv(m.u_antialiasingmatrix, !1, i.transform.lineAntialiasingMatrix), l.uniform1f(m.u_offset, -t.paint["line-offset"]), l.uniform1f(m.u_extra, i.transform.lineStretch), i.enableTileClippingMask(r);
                        var g = i.translatePosMatrix(r.posMatrix, n, t.paint["line-translate"], t.paint["line-translate-anchor"]);
                        if (l.uniformMatrix4fv(m.u_matrix, !1, g), f) {
                            var x = _.width * f.fromScale,
                                b = p.width * f.toScale,
                                c = [1 / pixelsToTileUnits(n, x, i.transform.tileZoom), -_.height / 2],
                                h = [1 / pixelsToTileUnits(n, b, i.transform.tileZoom), -p.height / 2],
                                w = i.lineAtlas.width / (256 * Math.min(x, b) * browser.devicePixelRatio) / 2;
                            l.uniform2fv(m.u_patternscale_a, c), l.uniform2fv(m.u_patternscale_b, h), l.uniform1f(m.u_sdfgamma, w) } else s && (l.uniform2fv(m.u_pattern_size_a, [pixelsToTileUnits(n, v.size[0] * s.fromScale, i.transform.tileZoom), d.size[1]]), l.uniform2fv(m.u_pattern_size_b, [pixelsToTileUnits(n, d.size[0] * s.toScale, i.transform.tileZoom), d.size[1]]));
                        l.uniform1f(m.u_ratio, 1 / pixelsToTileUnits(n, 1, i.transform.zoom)), a.setUniforms(l, "line", m, t, { zoom: i.transform.zoom });
                        for (var S = 0; S < o.length; S++) {
                            var y = o[S];
                            y.vaos[t.id].bind(l, m, y.layoutVertexBuffer, y.elementBuffer, y.paintVertexBuffers[t.id]), l.drawElements(l.TRIANGLES, 3 * y.elementBuffer.length, l.UNSIGNED_SHORT, 0) } } } }
            var browser = require("../util/browser"),
                pixelsToTileUnits = require("../source/pixels_to_tile_units");
            module.exports = function(i, e, t, r) {
                if (!i.isOpaquePass) { i.setDepthSublayer(0), i.depthMask(!1);
                    var n = i.gl;
                    if (n.enable(n.STENCIL_TEST), !(t.paint["line-width"] <= 0))
                        for (var a = 0; a < r.length; a++) drawLineTile(i, e, t, r[a]) } };
        }, { "../source/pixels_to_tile_units": 40, "../util/browser": 105 }],
        27: [function(require, module, exports) {
            "use strict";

            function drawRaster(r, t, e, a) {
                if (!r.isOpaquePass) {
                    var o = r.gl;
                    o.enable(o.DEPTH_TEST), r.depthMask(!0), o.depthFunc(o.LESS);
                    for (var n = a.length && a[0].z, i = 0; i < a.length; i++) {
                        var u = a[i];
                        r.setDepthSublayer(u.z - n), drawRasterTile(r, t, e, u) }
                    o.depthFunc(o.LEQUAL) } }

            function drawRasterTile(r, t, e, a) {
                var o = r.gl;
                o.disable(o.STENCIL_TEST);
                var n = t.getTile(a),
                    i = r.transform.calculatePosMatrix(a, t.getSource().maxzoom),
                    u = r.useProgram("raster");
                o.uniformMatrix4fv(u.u_matrix, !1, i), o.uniform1f(u.u_brightness_low, e.paint["raster-brightness-min"]), o.uniform1f(u.u_brightness_high, e.paint["raster-brightness-max"]), o.uniform1f(u.u_saturation_factor, saturationFactor(e.paint["raster-saturation"])), o.uniform1f(u.u_contrast_factor, contrastFactor(e.paint["raster-contrast"])), o.uniform3fv(u.u_spin_weights, spinWeights(e.paint["raster-hue-rotate"]));
                var s, c, f = n.sourceCache && n.sourceCache.findLoadedParent(a, 0, {}),
                    d = getOpacities(n, f, e, r.transform);
                o.activeTexture(o.TEXTURE0), o.bindTexture(o.TEXTURE_2D, n.texture), o.activeTexture(o.TEXTURE1), f ? (o.bindTexture(o.TEXTURE_2D, f.texture), s = Math.pow(2, f.coord.z - n.coord.z), c = [n.coord.x * s % 1, n.coord.y * s % 1]) : o.bindTexture(o.TEXTURE_2D, n.texture), o.uniform2fv(u.u_tl_parent, c || [0, 0]), o.uniform1f(u.u_scale_parent, s || 1), o.uniform1f(u.u_buffer_scale, 1), o.uniform1f(u.u_opacity0, d[0]), o.uniform1f(u.u_opacity1, d[1]), o.uniform1i(u.u_image0, 0), o.uniform1i(u.u_image1, 1);
                var m = n.boundsBuffer || r.rasterBoundsBuffer,
                    p = n.boundsVAO || r.rasterBoundsVAO;
                p.bind(o, u, m), o.drawArrays(o.TRIANGLE_STRIP, 0, m.length) }

            function spinWeights(r) { r *= Math.PI / 180;
                var t = Math.sin(r),
                    e = Math.cos(r);
                return [(2 * e + 1) / 3, (-Math.sqrt(3) * t - e + 1) / 3, (Math.sqrt(3) * t - e + 1) / 3] }

            function contrastFactor(r) {
                return r > 0 ? 1 / (1 - r) : 1 + r }

            function saturationFactor(r) {
                return r > 0 ? 1 - 1 / (1.001 - r) : -r }

            function getOpacities(r, t, e, a) {
                var o = [1, 0],
                    n = e.paint["raster-fade-duration"];
                if (r.sourceCache && n > 0) {
                    var i = Date.now(),
                        u = (i - r.timeAdded) / n,
                        s = t ? (i - t.timeAdded) / n : -1,
                        c = r.sourceCache.getSource(),
                        f = a.coveringZoomLevel({ tileSize: c.tileSize, roundZoom: c.roundZoom }),
                        d = !t || Math.abs(t.coord.z - f) > Math.abs(r.coord.z - f);
                    o[0] = util.clamp(d ? u : 1 - s, 0, 1), o[1] = t ? 1 - o[0] : 0 }
                var m = e.paint["raster-opacity"];
                return o[0] *= m, o[1] *= m, o }
            var util = require("../util/util"),
                StructArrayType = require("../util/struct_array");
            module.exports = drawRaster, drawRaster.RasterBoundsArray = new StructArrayType({ members: [{ name: "a_pos", type: "Int16", components: 2 }, { name: "a_texture_pos", type: "Int16", components: 2 }] });
        }, { "../util/struct_array": 120, "../util/util": 122 }],
        28: [function(require, module, exports) {
            "use strict";

            function drawSymbols(t, e, i, o) {
                if (!t.isOpaquePass) {
                    var a = !(i.layout["text-allow-overlap"] || i.layout["icon-allow-overlap"] || i.layout["text-ignore-placement"] || i.layout["icon-ignore-placement"]),
                        r = t.gl;
                    a ? r.disable(r.STENCIL_TEST) : r.enable(r.STENCIL_TEST), drawLayerSymbols(t, e, i, o, !1, i.paint["icon-translate"], i.paint["icon-translate-anchor"], i.layout["icon-rotation-alignment"], i.layout["icon-rotation-alignment"], i.layout["icon-size"], i.paint["icon-halo-width"], i.paint["icon-halo-color"], i.paint["icon-halo-blur"], i.paint["icon-opacity"], i.paint["icon-color"]), drawLayerSymbols(t, e, i, o, !0, i.paint["text-translate"], i.paint["text-translate-anchor"], i.layout["text-rotation-alignment"], i.layout["text-pitch-alignment"], i.layout["text-size"], i.paint["text-halo-width"], i.paint["text-halo-color"], i.paint["text-halo-blur"], i.paint["text-opacity"], i.paint["text-color"]), e.map.showCollisionBoxes && drawCollisionDebug(t, e, i, o) } }

            function drawLayerSymbols(t, e, i, o, a, r, n, l, u, s, f, m, p, c, h) {
                var d = t.gl;
                t.setDepthSublayer(0), t.depthMask(!1), "map" === u ? d.enable(d.DEPTH_TEST) : d.disable(d.DEPTH_TEST);
                for (var _ = 0; _ < o.length; _++) {
                    var x = e.getTile(o[_]),
                        g = x.getBucket(i);
                    if (g) {
                        var T = g.bufferGroups,
                            y = a ? T.glyph : T.icon;
                        y.length && (t.enableTileClippingMask(o[_]), drawSymbol(t, i, o[_].posMatrix, x, g, y, a, a || g.sdfIcons, !a && g.iconsNeedLinear, a ? g.adjustedTextSize : g.adjustedIconSize, g.fontstack, r, n, l, u, s, f, m, p, c, h)) } }
                d.enable(d.DEPTH_TEST) }

            function drawSymbol(t, e, i, o, a, r, n, l, u, s, f, m, p, c, h, d, _, x, g, T, y) {
                var b, v, S, w = t.gl,
                    E = t.transform,
                    I = "map" === c,
                    N = "map" === h,
                    L = n ? 24 : 1,
                    B = d / L;
                if (N ? (v = pixelsToTileUnits(o, 1, t.transform.zoom) * B, S = 1 / Math.cos(E._pitch), b = [v, v]) : (v = t.transform.altitude * B, S = 1, b = [E.pixelsToGLUnits[0] * v, E.pixelsToGLUnits[1] * v]), n || t.style.sprite.loaded()) {
                    var R = t.useProgram(l ? "symbolSDF" : "symbolIcon");
                    if (w.uniformMatrix4fv(R.u_matrix, !1, t.translatePosMatrix(i, o, m, p)), w.uniform1i(R.u_rotate_with_map, I), w.uniform1i(R.u_pitch_with_map, N), w.uniform2fv(R.u_extrude_scale, b), w.activeTexture(w.TEXTURE0), w.uniform1i(R.u_texture, 0), n) {
                        var z = f && t.glyphSource.getGlyphAtlas(f);
                        if (!z) return;
                        z.updateTexture(w), w.uniform2f(R.u_texsize, z.width / 4, z.height / 4) } else {
                        var D = t.options.rotating || t.options.zooming,
                            G = 1 !== B || browser.devicePixelRatio !== t.spriteAtlas.pixelRatio || u,
                            M = N || t.transform.pitch;
                        t.spriteAtlas.bind(w, l || D || G || M), w.uniform2f(R.u_texsize, t.spriteAtlas.width / 4, t.spriteAtlas.height / 4) }
                    var P = Math.log(d / s) / Math.LN2 || 0;
                    w.uniform1f(R.u_zoom, 10 * (t.transform.zoom - P)), w.activeTexture(w.TEXTURE1), t.frameHistory.bind(w), w.uniform1i(R.u_fadetexture, 1);
                    var U;
                    if (l) {
                        var A = 8,
                            H = 1.19,
                            C = 6,
                            k = .105 * L / d / browser.devicePixelRatio;
                        if (_) { w.uniform1f(R.u_gamma, (g * H / B / A + k) * S), w.uniform4fv(R.u_color, x), w.uniform1f(R.u_opacity, T), w.uniform1f(R.u_buffer, (C - _ / B) / A);
                            for (var q = 0; q < r.length; q++) U = r[q], U.vaos[e.id].bind(w, R, U.layoutVertexBuffer, U.elementBuffer), w.drawElements(w.TRIANGLES, 3 * U.elementBuffer.length, w.UNSIGNED_SHORT, 0) }
                        w.uniform1f(R.u_gamma, k * S), w.uniform4fv(R.u_color, y), w.uniform1f(R.u_opacity, T), w.uniform1f(R.u_buffer, .75), w.uniform1f(R.u_pitch, E.pitch / 360 * 2 * Math.PI), w.uniform1f(R.u_bearing, E.bearing / 360 * 2 * Math.PI), w.uniform1f(R.u_aspect_ratio, E.width / E.height);
                        for (var O = 0; O < r.length; O++) U = r[O], U.vaos[e.id].bind(w, R, U.layoutVertexBuffer, U.elementBuffer), w.drawElements(w.TRIANGLES, 3 * U.elementBuffer.length, w.UNSIGNED_SHORT, 0) } else { w.uniform1f(R.u_opacity, T);
                        for (var V = 0; V < r.length; V++) U = r[V], U.vaos[e.id].bind(w, R, U.layoutVertexBuffer, U.elementBuffer), w.drawElements(w.TRIANGLES, 3 * U.elementBuffer.length, w.UNSIGNED_SHORT, 0) } } }
            var browser = require("../util/browser"),
                drawCollisionDebug = require("./draw_collision_debug"),
                pixelsToTileUnits = require("../source/pixels_to_tile_units");
            module.exports = drawSymbols;
        }, { "../source/pixels_to_tile_units": 40, "../util/browser": 105, "./draw_collision_debug": 22 }],
        29: [function(require, module, exports) {
            "use strict";

            function FrameHistory() { this.changeTimes = new Float64Array(256), this.changeOpacities = new Uint8Array(256), this.opacities = new Uint8ClampedArray(256), this.array = new Uint8Array(this.opacities.buffer), this.fadeDuration = 300, this.previousZoom = 0, this.firstFrame = !0 }
            module.exports = FrameHistory, FrameHistory.prototype.record = function(t) {
                var i = Date.now();
                this.firstFrame && (i = 0, this.firstFrame = !1), t = Math.floor(10 * t);
                var e;
                if (t < this.previousZoom)
                    for (e = t + 1; e <= this.previousZoom; e++) this.changeTimes[e] = i, this.changeOpacities[e] = this.opacities[e];
                else
                    for (e = t; e > this.previousZoom; e--) this.changeTimes[e] = i, this.changeOpacities[e] = this.opacities[e];
                for (e = 0; e < 256; e++) {
                    var s = i - this.changeTimes[e],
                        r = s / this.fadeDuration * 255;
                    e <= t ? this.opacities[e] = this.changeOpacities[e] + r : this.opacities[e] = this.changeOpacities[e] - r }
                this.changed = !0, this.previousZoom = t }, FrameHistory.prototype.bind = function(t) { this.texture ? (t.bindTexture(t.TEXTURE_2D, this.texture), this.changed && (t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, 256, 1, t.ALPHA, t.UNSIGNED_BYTE, this.array), this.changed = !1)) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.NEAREST), t.texImage2D(t.TEXTURE_2D, 0, t.ALPHA, 256, 1, 0, t.ALPHA, t.UNSIGNED_BYTE, this.array)) };
        }, {}],
        30: [function(require, module, exports) {
            "use strict";

            function LineAtlas(t, i) { this.width = t, this.height = i, this.nextRow = 0, this.bytes = 4, this.data = new Uint8Array(this.width * this.height * this.bytes), this.positions = {} }
            var util = require("../util/util");
            module.exports = LineAtlas, LineAtlas.prototype.setSprite = function(t) { this.sprite = t }, LineAtlas.prototype.getDash = function(t, i) {
                var e = t.join(",") + i;
                return this.positions[e] || (this.positions[e] = this.addDash(t, i)), this.positions[e] }, LineAtlas.prototype.addDash = function(t, i) {
                var e = i ? 7 : 0,
                    h = 2 * e + 1,
                    s = 128;
                if (this.nextRow + h > this.height) return util.warnOnce("LineAtlas out of space"), null;
                for (var a = 0, r = 0; r < t.length; r++) a += t[r];
                for (var n = this.width / a, E = n / 2, o = t.length % 2 === 1, T = -e; T <= e; T++)
                    for (var R = this.nextRow + e + T, u = this.width * R, d = o ? -t[t.length - 1] : 0, l = t[0], x = 1, A = 0; A < this.width; A++) {
                        for (; l < A / n;) d = l, l += t[x], o && x === t.length - 1 && (l += t[0]), x++;
                        var _, p = Math.abs(A - d * n),
                            g = Math.abs(A - l * n),
                            w = Math.min(p, g),
                            D = x % 2 === 1;
                        if (i) {
                            var U = e ? T / e * (E + 1) : 0;
                            if (D) {
                                var f = E - Math.abs(U);
                                _ = Math.sqrt(w * w + f * f) } else _ = E - Math.sqrt(w * w + U * U) } else _ = (D ? 1 : -1) * w;
                        this.data[3 + 4 * (u + A)] = Math.max(0, Math.min(255, _ + s)) }
                var X = { y: (this.nextRow + e + .5) / this.height, height: 2 * e / this.height, width: a };
                return this.nextRow += h, this.dirty = !0, X }, LineAtlas.prototype.bind = function(t) { this.texture ? (t.bindTexture(t.TEXTURE_2D, this.texture), this.dirty && (this.dirty = !1, t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.RGBA, t.UNSIGNED_BYTE, this.data))) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.REPEAT), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width, this.height, 0, t.RGBA, t.UNSIGNED_BYTE, this.data)) };
        }, { "../util/util": 122 }],
        31: [function(require, module, exports) {
            "use strict";

            function Painter(e, t) { this.gl = e, this.transform = t, this.reusableTextures = {}, this.preFbos = {}, this.frameHistory = new FrameHistory, this.setup(), this.numSublayers = SourceCache.maxUnderzooming + SourceCache.maxOverzooming + 1, this.depthEpsilon = 1 / Math.pow(2, 16), this.lineWidthRange = e.getParameter(e.ALIASED_LINE_WIDTH_RANGE) }
            var browser = require("../util/browser"),
                mat4 = require("gl-matrix").mat4,
                FrameHistory = require("./frame_history"),
                SourceCache = require("../source/source_cache"),
                EXTENT = require("../data/bucket").EXTENT,
                pixelsToTileUnits = require("../source/pixels_to_tile_units"),
                util = require("../util/util"),
                StructArrayType = require("../util/struct_array"),
                Buffer = require("../data/buffer"),
                VertexArrayObject = require("./vertex_array_object"),
                RasterBoundsArray = require("./draw_raster").RasterBoundsArray,
                createUniformPragmas = require("./create_uniform_pragmas");
            module.exports = Painter, util.extend(Painter.prototype, require("./painter/use_program")), Painter.prototype.resize = function(e, t) {
                var r = this.gl;
                this.width = e * browser.devicePixelRatio, this.height = t * browser.devicePixelRatio, r.viewport(0, 0, this.width, this.height) }, Painter.prototype.setup = function() {
                var e = this.gl;
                e.verbose = !0, e.enable(e.BLEND), e.blendFunc(e.ONE, e.ONE_MINUS_SRC_ALPHA), e.enable(e.STENCIL_TEST), e.enable(e.DEPTH_TEST), e.depthFunc(e.LEQUAL), this._depthMask = !1, e.depthMask(!1);
                var t = this.PosArray = new StructArrayType({ members: [{ name: "a_pos", type: "Int16", components: 2 }] }),
                    r = new t;
                r.emplaceBack(0, 0), r.emplaceBack(EXTENT, 0), r.emplaceBack(0, EXTENT), r.emplaceBack(EXTENT, EXTENT), this.tileExtentBuffer = new Buffer(r.serialize(), t.serialize(), Buffer.BufferType.VERTEX), this.tileExtentVAO = new VertexArrayObject, this.tileExtentPatternVAO = new VertexArrayObject;
                var i = new t;
                i.emplaceBack(0, 0), i.emplaceBack(EXTENT, 0), i.emplaceBack(EXTENT, EXTENT), i.emplaceBack(0, EXTENT), i.emplaceBack(0, 0), this.debugBuffer = new Buffer(i.serialize(), t.serialize(), Buffer.BufferType.VERTEX), this.debugVAO = new VertexArrayObject;
                var s = new RasterBoundsArray;
                s.emplaceBack(0, 0, 0, 0), s.emplaceBack(EXTENT, 0, 32767, 0), s.emplaceBack(0, EXTENT, 0, 32767), s.emplaceBack(EXTENT, EXTENT, 32767, 32767), this.rasterBoundsBuffer = new Buffer(s.serialize(), RasterBoundsArray.serialize(), Buffer.BufferType.VERTEX), this.rasterBoundsVAO = new VertexArrayObject }, Painter.prototype.clearColor = function() {
                var e = this.gl;
                e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT) }, Painter.prototype.clearStencil = function() {
                var e = this.gl;
                e.clearStencil(0), e.stencilMask(255), e.clear(e.STENCIL_BUFFER_BIT) }, Painter.prototype.clearDepth = function() {
                var e = this.gl;
                e.clearDepth(1), this.depthMask(!0), e.clear(e.DEPTH_BUFFER_BIT) }, Painter.prototype._renderTileClippingMasks = function(e) {
                var t = this.gl;
                t.colorMask(!1, !1, !1, !1), this.depthMask(!1), t.disable(t.DEPTH_TEST), t.enable(t.STENCIL_TEST), t.stencilMask(248), t.stencilOp(t.KEEP, t.KEEP, t.REPLACE);
                var r = 1;
                this._tileClippingMaskIDs = {};
                for (var i = 0; i < e.length; i++) {
                    var s = e[i],
                        a = this._tileClippingMaskIDs[s.id] = r++ << 3;
                    t.stencilFunc(t.ALWAYS, a, 248);
                    var n = createUniformPragmas([{ name: "u_color", components: 4 }, { name: "u_opacity", components: 1 }]),
                        o = this.useProgram("fill", [], n, n);
                    t.uniformMatrix4fv(o.u_matrix, !1, s.posMatrix), this.tileExtentVAO.bind(t, o, this.tileExtentBuffer), t.drawArrays(t.TRIANGLE_STRIP, 0, this.tileExtentBuffer.length) }
                t.stencilMask(0), t.colorMask(!0, !0, !0, !0), this.depthMask(!0), t.enable(t.DEPTH_TEST) }, Painter.prototype.enableTileClippingMask = function(e) {
                var t = this.gl;
                t.stencilFunc(t.EQUAL, this._tileClippingMaskIDs[e.id], 248) }, Painter.prototype.prepareBuffers = function() {}, Painter.prototype.bindDefaultFramebuffer = function() {
                var e = this.gl;
                e.bindFramebuffer(e.FRAMEBUFFER, null) };
            var draw = { symbol: require("./draw_symbol"), circle: require("./draw_circle"), line: require("./draw_line"), fill: require("./draw_fill"), extrusion: require("./draw_extrusion"), raster: require("./draw_raster"), background: require("./draw_background"), debug: require("./draw_debug") };
            Painter.prototype.render = function(e, t) { this.style = e, this.options = t, this.lineAtlas = e.lineAtlas, this.spriteAtlas = e.spriteAtlas, this.spriteAtlas.setSprite(e.sprite), this.glyphSource = e.glyphSource, this.frameHistory.record(this.transform.zoom), this.prepareBuffers(), this.clearColor(), this.clearDepth(), this.showOverdrawInspector(t.showOverdrawInspector), this.depthRange = (e._order.length + 2) * this.numSublayers * this.depthEpsilon, this.renderPass({ isOpaquePass: !0 }), this.renderPass({ isOpaquePass: !1 }) }, Painter.prototype.renderPass = function(e) {
                var t = this.style._groups,
                    r = e.isOpaquePass;
                this.currentLayer = r ? this.style._order.length : -1;
                for (var i = 0; i < t.length; i++) {
                    var s, a = t[r ? t.length - 1 - i : i],
                        n = this.style.sourceCaches[a.source],
                        o = [];
                    if (n) {
                        for (o = n.getVisibleCoordinates(), s = 0; s < o.length; s++) o[s].posMatrix = this.transform.calculatePosMatrix(o[s], n.getSource().maxzoom);
                        this.clearStencil(), n.prepare && n.prepare(), n.getSource().isTileClipped && this._renderTileClippingMasks(o) }
                    for (r ? (this._showOverdrawInspector || this.gl.disable(this.gl.BLEND), this.isOpaquePass = !0) : (this.gl.enable(this.gl.BLEND), this.isOpaquePass = !1, o.reverse()), s = 0; s < a.length; s++) {
                        var l = a[r ? a.length - 1 - s : s];
                        this.currentLayer += r ? -1 : 1, this.renderLayer(this, n, l, o) }
                    n && draw.debug(this, n, o) } }, Painter.prototype.depthMask = function(e) { e !== this._depthMask && (this._depthMask = e, this.gl.depthMask(e)) }, Painter.prototype.renderLayer = function(e, t, r, i) {
                if (!r.isHidden(this.transform.zoom) && ("background" === r.type || i.length)) { this.id = r.id;
                    var s = r.type; "fill" !== s || r.isPaintValueFeatureConstant("fill-extrude-height") && r.isPaintValueZoomConstant("fill-extrude-height") && 0 === r.getPaintValue("fill-extrude-height") || (s = "extrusion"), draw[s](e, t, r, i) } }, Painter.prototype.setDepthSublayer = function(e) {
                var t = 1 - ((1 + this.currentLayer) * this.numSublayers + e) * this.depthEpsilon,
                    r = t - 1 + this.depthRange;
                this.gl.depthRange(r, t) }, Painter.prototype.translatePosMatrix = function(e, t, r, i) {
                if (!r[0] && !r[1]) return e;
                if ("viewport" === i) {
                    var s = Math.sin(-this.transform.angle),
                        a = Math.cos(-this.transform.angle);
                    r = [r[0] * a - r[1] * s, r[0] * s + r[1] * a] }
                var n = [pixelsToTileUnits(t, r[0], this.transform.zoom), pixelsToTileUnits(t, r[1], this.transform.zoom), 0],
                    o = new Float32Array(16);
                return mat4.translate(o, e, n), o }, Painter.prototype.saveTileTexture = function(e) {
                var t = this.reusableTextures[e.size];
                t ? t.push(e) : this.reusableTextures[e.size] = [e] }, Painter.prototype.saveViewportTexture = function(e) { this.reusableTextures.viewport || (this.reusableTextures.viewport = {}), this.reusableTextures.viewport.texture = e }, Painter.prototype.getTileTexture = function(e, t) {
                var r = this.reusableTextures[e];
                if (r) {
                    var i = r[t || e];
                    return i && i.length > 0 ? i.pop() : null } }, Painter.prototype.getViewportTexture = function(e, t) {
                if (this.reusableTextures.viewport) {
                    var r = this.reusableTextures.viewport.texture;
                    return r.width === e && r.height === t ? r : (this.gl.deleteTexture(r), void(this.reusableTextures.viewport.texture = null)) } }, Painter.prototype.lineWidth = function(e) { this.gl.lineWidth(util.clamp(e, this.lineWidthRange[0], this.lineWidthRange[1])) }, Painter.prototype.showOverdrawInspector = function(e) {
                if (e || this._showOverdrawInspector) { this._showOverdrawInspector = e;
                    var t = this.gl;
                    if (e) { t.blendFunc(t.CONSTANT_COLOR, t.ONE);
                        var r = 8,
                            i = 1 / r;
                        t.blendColor(i, i, i, 0), t.clearColor(0, 0, 0, 1), t.clear(t.COLOR_BUFFER_BIT) } else t.blendFunc(t.ONE, t.ONE_MINUS_SRC_ALPHA) } };
        }, { "../data/bucket": 2, "../data/buffer": 8, "../source/pixels_to_tile_units": 40, "../source/source_cache": 44, "../util/browser": 105, "../util/struct_array": 120, "../util/util": 122, "./create_uniform_pragmas": 19, "./draw_background": 20, "./draw_circle": 21, "./draw_debug": 23, "./draw_extrusion": 24, "./draw_fill": 25, "./draw_line": 26, "./draw_raster": 27, "./draw_symbol": 28, "./frame_history": 29, "./painter/use_program": 32, "./vertex_array_object": 34, "gl-matrix": 150 }],
        32: [function(require, module, exports) {
            "use strict";

            function applyPragmas(r, e) {
                return r.replace(/#pragma mapbox: ([\w]+) ([\w]+) ([\w]+) ([\w]+)/g, function(r, a, t, i, o) {
                    return e[a][o].replace(/{type}/g, i).replace(/{precision}/g, t) }) }
            var util = require("../../util/util"),
                shaders = require("mapbox-gl-shaders"),
                utilSource = shaders.util;
            module.exports._createProgram = function(r, e, a, t) {
                for (var i = this.gl, o = i.createProgram(), c = shaders[r], n = "#define MAPBOX_GL_JS;\n", s = 0; s < e.length; s++) n += "#define " + e[s] + ";\n";
                var m = i.createShader(i.FRAGMENT_SHADER);
                i.shaderSource(m, applyPragmas(n + c.fragmentSource, t)), i.compileShader(m), i.attachShader(o, m);
                var g = i.createShader(i.VERTEX_SHADER);
                i.shaderSource(g, applyPragmas(n + utilSource + c.vertexSource, a)), i.compileShader(g), i.attachShader(o, g), i.linkProgram(o);
                for (var u = {}, h = i.getProgramParameter(o, i.ACTIVE_ATTRIBUTES), d = 0; d < h; d++) {
                    var l = i.getActiveAttrib(o, d);
                    u[l.name] = i.getAttribLocation(o, l.name) }
                for (var p = {}, P = i.getProgramParameter(o, i.ACTIVE_UNIFORMS), S = 0; S < P; S++) {
                    var f = i.getActiveUniform(o, S);
                    p[f.name] = i.getUniformLocation(o, f.name) }
                return util.extend({ program: o, definition: c, attributes: u, numAttributes: h }, u, p) }, module.exports._createProgramCached = function(r, e, a, t) { this.cache = this.cache || {};
                var i = JSON.stringify({ name: r, defines: e, vertexPragmas: a, fragmentPragmas: t });
                return this.cache[i] || (this.cache[i] = this._createProgram(r, e, a, t)), this.cache[i] }, module.exports.useProgram = function(r, e, a, t) {
                var i = this.gl;
                e = e || [], this._showOverdrawInspector && (e = e.concat("OVERDRAW_INSPECTOR"));
                var o = this._createProgramCached(r, e, a, t),
                    c = this.currentProgram;
                return c !== o && (i.useProgram(o.program), this.currentProgram = o), o };
        }, { "../../util/util": 122, "mapbox-gl-shaders": 163 }],
        33: [function(require, module, exports) {
            "use strict";

            function setPattern(t, o, r, i, e, _) {
                var u = i.gl,
                    f = i.spriteAtlas.getPosition(t.from, !0),
                    n = i.spriteAtlas.getPosition(t.to, !0);
                if (f && n) { u.uniform1i(e.u_image, 0), u.uniform2fv(e.u_pattern_tl_a, f.tl), u.uniform2fv(e.u_pattern_br_a, f.br), u.uniform2fv(e.u_pattern_tl_b, n.tl), u.uniform2fv(e.u_pattern_br_b, n.br), u.uniform1f(e.u_mix, t.t), u.uniform1f(e.u_tile_units_to_pixels, 1 / pixelsToTileUnits(o, 1, i.transform.tileZoom)), u.uniform2fv(e.u_pattern_size_a, f.size), u.uniform2fv(e.u_pattern_size_b, n.size), u.uniform1f(e.u_scale_a, t.fromScale), u.uniform1f(e.u_scale_b, t.toScale);
                    var a = o.tileSize * Math.pow(2, i.transform.tileZoom - o.coord.z),
                        s = a * (o.coord.x + r.w * Math.pow(2, o.coord.z)),
                        l = a * o.coord.y;
                    u.uniform2f(e.u_pixel_coord_upper, s >> 16, l >> 16), u.uniform2f(e.u_pixel_coord_lower, 65535 & s, 65535 & l), _ && u.uniform1f(e.u_height_factor, -Math.pow(2, i.transform.tileZoom) / a >> 3), u.activeTexture(u.TEXTURE0), i.spriteAtlas.bind(u, !0) } }
            var pixelsToTileUnits = require("../source/pixels_to_tile_units");
            module.exports = setPattern;
        }, { "../source/pixels_to_tile_units": 40 }],
        34: [function(require, module, exports) {
            "use strict";

            function VertexArrayObject() { this.boundProgram = null, this.boundVertexBuffer = null, this.boundVertexBuffer2 = null, this.boundElementBuffer = null, this.vao = null }
            module.exports = VertexArrayObject, VertexArrayObject.prototype.bind = function(e, t, r, i, n) { void 0 === e.extVertexArrayObject && (e.extVertexArrayObject = e.getExtension("OES_vertex_array_object"));
                var o = !this.vao || this.boundProgram !== t || this.boundVertexBuffer !== r || this.boundVertexBuffer2 !== n || this.boundElementBuffer !== i;!e.extVertexArrayObject || o ? (this.freshBind(e, t, r, i, n), this.gl = e) : e.extVertexArrayObject.bindVertexArrayOES(this.vao) }, VertexArrayObject.prototype.freshBind = function(e, t, r, i, n) {
                var o, s = t.numAttributes;
                if (e.extVertexArrayObject) this.vao && this.destroy(), this.vao = e.extVertexArrayObject.createVertexArrayOES(), e.extVertexArrayObject.bindVertexArrayOES(this.vao), o = 0, this.boundProgram = t, this.boundVertexBuffer = r, this.boundVertexBuffer2 = n, this.boundElementBuffer = i;
                else { o = e.currentNumAttributes || 0;
                    for (var b = s; b < o; b++) e.disableVertexAttribArray(b) }
                for (var u = o; u < s; u++) e.enableVertexAttribArray(u);
                r.bind(e), r.setVertexAttribPointers(e, t), n && (n.bind(e), n.setVertexAttribPointers(e, t)), i && i.bind(e), e.currentNumAttributes = s }, VertexArrayObject.prototype.destroy = function() { this.vao && (this.gl.extVertexArrayObject.deleteVertexArrayOES(this.vao), this.vao = null) };
        }, {}],
        35: [function(require, module, exports) {
            "use strict";

            function GeoJSONSource(t, e, i, o) { e = e || {}, this.id = t, this.dispatcher = i, this._data = e.data, void 0 !== e.maxzoom && (this.maxzoom = e.maxzoom), e.type && (this.type = e.type);
                var r = EXTENT / this.tileSize;
                this.workerOptions = util.extend({ source: this.id, cluster: e.cluster || !1, geojsonVtOptions: { buffer: (void 0 !== e.buffer ? e.buffer : 128) * r, tolerance: (void 0 !== e.tolerance ? e.tolerance : .375) * r, extent: EXTENT, maxZoom: this.maxzoom }, superclusterOptions: { maxZoom: Math.min(e.clusterMaxZoom, this.maxzoom - 1) || this.maxzoom - 1, extent: EXTENT, radius: (e.clusterRadius || 50) * r, log: !1 } }, e.workerOptions), this.setEventedParent(o), this.fire("dataloading", { dataType: "source" }), this._updateWorkerData(function(t) {
                    return t ? void this.fire("error", { error: t }) : (this.fire("data", { dataType: "source" }), void this.fire("source.load")) }.bind(this)) }

            function resolveURL(t) {
                var e = window.document.createElement("a");
                return e.href = t, e.href }
            var Evented = require("../util/evented"),
                util = require("../util/util"),
                window = require("../util/window"),
                EXTENT = require("../data/bucket").EXTENT;
            module.exports = GeoJSONSource, GeoJSONSource.prototype = util.inherit(Evented, { type: "geojson", minzoom: 0, maxzoom: 18, tileSize: 512, isTileClipped: !0, reparseOverscaled: !0, onAdd: function(t) { this.map = t }, setData: function(t) {
                    return this._data = t, this.fire("dataloading", { dataType: "source" }), this._updateWorkerData(function(t) {
                        return t ? this.fire("error", { error: t }) : void this.fire("data", { dataType: "source" }) }.bind(this)), this }, _updateWorkerData: function(t) {
                    var e = util.extend({}, this.workerOptions),
                        i = this._data; "string" == typeof i ? e.url = resolveURL(i) : e.data = JSON.stringify(i), this.workerID = this.dispatcher.send(this.type + ".loadData", e, function(e) { this._loaded = !0, t(e) }.bind(this)) }, loadTile: function(t, e) {
                    var i = t.coord.z > this.maxzoom ? Math.pow(2, t.coord.z - this.maxzoom) : 1,
                        o = { type: this.type, uid: t.uid, coord: t.coord, zoom: t.coord.z, maxZoom: this.maxzoom, tileSize: this.tileSize, source: this.id, overscaling: i, angle: this.map.transform.angle, pitch: this.map.transform.pitch, showCollisionBoxes: this.map.showCollisionBoxes };
                    t.workerID = this.dispatcher.send("load tile", o, function(i, o) {
                        if (t.unloadVectorData(), !t.aborted) return i ? e(i) : (t.loadVectorData(o, this.map.painter), t.redoWhenDone && (t.redoWhenDone = !1, t.redoPlacement(this)), e(null)) }.bind(this), this.workerID) }, abortTile: function(t) { t.aborted = !0 }, unloadTile: function(t) { t.unloadVectorData(), this.dispatcher.send("remove tile", { uid: t.uid, source: this.id }, function() {}, t.workerID) }, serialize: function() {
                    return { type: this.type, data: this._data } } });
        }, { "../data/bucket": 2, "../util/evented": 113, "../util/util": 122, "../util/window": 107 }],
        36: [function(require, module, exports) {
            "use strict";

            function GeoJSONWorkerSource(e, r, t) { t && (this.loadGeoJSON = t), VectorTileWorkerSource.call(this, e, r) }
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                rewind = require("geojson-rewind"),
                GeoJSONWrapper = require("./geojson_wrapper"),
                vtpbf = require("vt-pbf"),
                supercluster = require("supercluster"),
                geojsonvt = require("geojson-vt"),
                VectorTileWorkerSource = require("./vector_tile_worker_source");
            module.exports = GeoJSONWorkerSource, GeoJSONWorkerSource.prototype = util.inherit(VectorTileWorkerSource, { _geoJSONIndexes: {}, loadVectorData: function(e, r) {
                    var t = e.source,
                        o = e.coord;
                    if (!this._geoJSONIndexes[t]) return r(null, null);
                    var n = this._geoJSONIndexes[t].getTile(Math.min(o.z, e.maxZoom), o.x, o.y);
                    if (!n) return r(null, null);
                    var u = new GeoJSONWrapper(n.features);
                    u.name = "_geojsonTileLayer";
                    var i = vtpbf({ layers: { _geojsonTileLayer: u } });
                    0 === i.byteOffset && i.byteLength === i.buffer.byteLength || (i = new Uint8Array(i)), u.rawData = i.buffer, r(null, u) }, loadData: function(e, r) {
                    var t = function(t, o) {
                        return t ? r(t) : "object" != typeof o ? r(new Error("Input data is not a valid GeoJSON object.")) : (rewind(o, !0), void this._indexData(o, e, function(t, o) {
                            return t ? r(t) : (this._geoJSONIndexes[e.source] = o, void r(null)) }.bind(this))) }.bind(this);
                    this.loadGeoJSON(e, t) }, loadGeoJSON: function(e, r) {
                    if (e.url) ajax.getJSON(e.url, r);
                    else {
                        if ("string" != typeof e.data) return r(new Error("Input data is not a valid GeoJSON object."));
                        try {
                            return r(null, JSON.parse(e.data)) } catch (e) {
                            return r(new Error("Input data is not a valid GeoJSON object.")) } } }, _indexData: function(e, r, t) {
                    try { r.cluster ? t(null, supercluster(r.superclusterOptions).load(e.features)) : t(null, geojsonvt(e, r.geojsonVtOptions)) } catch (e) {
                        return t(e) } } });
        }, { "../util/ajax": 104, "../util/util": 122, "./geojson_wrapper": 37, "./vector_tile_worker_source": 48, "geojson-rewind": 139, "geojson-vt": 145, "supercluster": 195, "vt-pbf": 206 }],
        37: [function(require, module, exports) {
            "use strict";

            function GeoJSONWrapper(e) { this.features = e, this.length = e.length, this.extent = EXTENT }

            function FeatureWrapper(e) {
                if (this.type = e.type, 1 === e.type) { this.rawGeometry = [];
                    for (var t = 0; t < e.geometry.length; t++) this.rawGeometry.push([e.geometry[t]]) } else this.rawGeometry = e.geometry;
                this.properties = e.tags, this.extent = EXTENT }
            var Point = require("point-geometry"),
                VectorTileFeature = require("vector-tile").VectorTileFeature,
                EXTENT = require("../data/bucket").EXTENT;
            module.exports = GeoJSONWrapper, GeoJSONWrapper.prototype.feature = function(e) {
                return new FeatureWrapper(this.features[e]) }, FeatureWrapper.prototype.loadGeometry = function() {
                var e = this.rawGeometry;
                this.geometry = [];
                for (var t = 0; t < e.length; t++) {
                    for (var r = e[t], o = [], a = 0; a < r.length; a++) o.push(new Point(r[a][0], r[a][1]));
                    this.geometry.push(o) }
                return this.geometry }, FeatureWrapper.prototype.bbox = function() { this.geometry || this.loadGeometry();
                for (var e = this.geometry, t = 1 / 0, r = -(1 / 0), o = 1 / 0, a = -(1 / 0), i = 0; i < e.length; i++)
                    for (var p = e[i], h = 0; h < p.length; h++) {
                        var n = p[h];
                        t = Math.min(t, n.x), r = Math.max(r, n.x), o = Math.min(o, n.y), a = Math.max(a, n.y) }
                return [t, o, r, a] }, FeatureWrapper.prototype.toGeoJSON = VectorTileFeature.prototype.toGeoJSON;
        }, { "../data/bucket": 2, "point-geometry": 192, "vector-tile": 202 }],
        38: [function(require, module, exports) {
            "use strict";

            function ImageSource(e, t, r, i) { this.id = e, this.dispatcher = r, this.url = t.url, this.coordinates = t.coordinates, this.setEventedParent(i), this.fire("dataloading", { dataType: "source" }), ajax.getImage(t.url, function(e, r) {
                    return e ? this.fire("error", { error: e }) : (this.image = r, this._loaded = !0, this.fire("data", { dataType: "source" }), this.fire("source.load"), void(this.map && this.setCoordinates(t.coordinates))) }.bind(this)) }
            var util = require("../util/util"),
                TileCoord = require("./tile_coord"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Evented = require("../util/evented"),
                ajax = require("../util/ajax"),
                EXTENT = require("../data/bucket").EXTENT,
                RasterBoundsArray = require("../render/draw_raster").RasterBoundsArray,
                Buffer = require("../data/buffer"),
                VertexArrayObject = require("../render/vertex_array_object");
            module.exports = ImageSource, ImageSource.prototype = util.inherit(Evented, { minzoom: 0, maxzoom: 22, tileSize: 512, onAdd: function(e) { this.map = e, this.image && this.setCoordinates(this.coordinates) }, setCoordinates: function(e) { this.coordinates = e;
                    var t = this.map,
                        r = e.map(function(e) {
                            return t.transform.locationCoordinate(LngLat.convert(e)).zoomTo(0) }),
                        i = this.centerCoord = util.getCoordinatesCenter(r);
                    return i.column = Math.round(i.column), i.row = Math.round(i.row), this.minzoom = this.maxzoom = i.zoom, this.coord = new TileCoord(i.zoom, i.column, i.row), this._tileCoords = r.map(function(e) {
                        var t = e.zoomTo(i.zoom);
                        return new Point(Math.round((t.column - i.column) * EXTENT), Math.round((t.row - i.row) * EXTENT)) }), this.fire("data", { dataType: "source" }), this }, _setTile: function(e) { this._prepared = !1, this.tile = e;
                    var t = 32767,
                        r = new RasterBoundsArray;
                    r.emplaceBack(this._tileCoords[0].x, this._tileCoords[0].y, 0, 0), r.emplaceBack(this._tileCoords[1].x, this._tileCoords[1].y, t, 0), r.emplaceBack(this._tileCoords[3].x, this._tileCoords[3].y, 0, t), r.emplaceBack(this._tileCoords[2].x, this._tileCoords[2].y, t, t), this.tile.buckets = {}, this.tile.boundsBuffer = new Buffer(r.serialize(), RasterBoundsArray.serialize(), Buffer.BufferType.VERTEX), this.tile.boundsVAO = new VertexArrayObject, this.tile.state = "loaded" }, prepare: function() { this.tile && this._loaded && this.image && this.image.complete && this._prepareImage(this.map.painter.gl, this.image) }, _prepareImage: function(e, t) { this._prepared ? (e.bindTexture(e.TEXTURE_2D, this.tile.texture), e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, e.RGBA, e.UNSIGNED_BYTE, t)) : (this._prepared = !0, this.tile.texture = e.createTexture(), e.bindTexture(e.TEXTURE_2D, this.tile.texture), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.LINEAR), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.LINEAR), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, e.RGBA, e.UNSIGNED_BYTE, t)) }, loadTile: function(e, t) { this.coord && this.coord.toString() === e.coord.toString() ? (this._setTile(e), t(null)) : (e.state = "errored", t(null)) }, serialize: function() {
                    return { type: "image", urls: this.url, coordinates: this.coordinates } } });
        }, { "../data/bucket": 2, "../data/buffer": 8, "../geo/lng_lat": 13, "../render/draw_raster": 27, "../render/vertex_array_object": 34, "../util/ajax": 104, "../util/evented": 113, "../util/util": 122, "./tile_coord": 46, "point-geometry": 192 }],
        39: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                normalizeURL = require("../util/mapbox").normalizeSourceURL;
            module.exports = function(r, e) {
                var i = function(r, i) {
                    if (r) return e(r);
                    var t = util.pick(i, ["tiles", "minzoom", "maxzoom", "attribution"]);
                    i.vector_layers && (t.vectorLayers = i.vector_layers, t.vectorLayerIds = t.vectorLayers.map(function(r) {
                        return r.id })), e(null, t) };
                r.url ? ajax.getJSON(normalizeURL(r.url), i) : browser.frame(i.bind(null, null, r)) };
        }, { "../util/ajax": 104, "../util/browser": 105, "../util/mapbox": 119, "../util/util": 122 }],
        40: [function(require, module, exports) {
            "use strict";
            var Bucket = require("../data/bucket");
            module.exports = function(e, t, r) {
                return t * (Bucket.EXTENT / (e.tileSize * Math.pow(2, r - e.coord.z))) };
        }, { "../data/bucket": 2 }],
        41: [function(require, module, exports) {
            "use strict";

            function sortTilesIn(e, r) {
                var o = e.coord,
                    t = r.coord;
                return o.z - t.z || o.y - t.y || o.w - t.w || o.x - t.x }

            function mergeRenderedFeatureLayers(e) {
                for (var r = e[0] || {}, o = 1; o < e.length; o++) {
                    var t = e[o];
                    for (var n in t) {
                        var a = t[n],
                            i = r[n];
                        if (void 0 === i) i = r[n] = a;
                        else
                            for (var u = 0; u < a.length; u++) i.push(a[u]) } }
                return r }
            var TileCoord = require("./tile_coord");
            exports.rendered = function(e, r, o, t, n, a) {
                var i = e.tilesIn(o);
                i.sort(sortTilesIn);
                for (var u = [], s = 0; s < i.length; s++) {
                    var d = i[s];
                    d.tile.featureIndex && u.push(d.tile.featureIndex.query({ queryGeometry: d.queryGeometry, scale: d.scale, tileSize: d.tile.tileSize, bearing: a, params: t }, r)) }
                return mergeRenderedFeatureLayers(u) }, exports.source = function(e, r) {
                for (var o = e.getRenderableIds().map(function(r) {
                        return e.getTileByID(r) }), t = [], n = {}, a = 0; a < o.length; a++) {
                    var i = o[a],
                        u = new TileCoord(Math.min(i.sourceMaxZoom, i.coord.z), i.coord.x, i.coord.y, 0).id;
                    n[u] || (n[u] = !0, i.querySourceFeatures(t, r)) }
                return t };
        }, { "./tile_coord": 46 }],
        42: [function(require, module, exports) {
            "use strict";

            function RasterTileSource(e, t, i, r) { this.id = e, this.dispatcher = i, util.extend(this, util.pick(t, ["url", "scheme", "tileSize"])), this.setEventedParent(r), this.fire("dataloading", { dataType: "source" }), loadTileJSON(t, function(e, t) {
                    return e ? this.fire("error", e) : (util.extend(this, t), this.fire("data", { dataType: "source" }), void this.fire("source.load")) }.bind(this)) }
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                Evented = require("../util/evented"),
                loadTileJSON = require("./load_tilejson"),
                normalizeURL = require("../util/mapbox").normalizeTileURL;
            module.exports = RasterTileSource, RasterTileSource.prototype = util.inherit(Evented, { minzoom: 0, maxzoom: 22, roundZoom: !0, scheme: "xyz", tileSize: 512, _loaded: !1, onAdd: function(e) { this.map = e }, serialize: function() {
                    return { type: "raster", url: this.url, tileSize: this.tileSize, tiles: this.tiles } }, loadTile: function(e, t) {
                    function i(i, r) {
                        if (delete e.request, !e.aborted) {
                            if (i) return t(i);
                            var a = this.map.painter.gl;
                            e.texture = this.map.painter.getTileTexture(r.width), e.texture ? (a.bindTexture(a.TEXTURE_2D, e.texture), a.texSubImage2D(a.TEXTURE_2D, 0, 0, 0, a.RGBA, a.UNSIGNED_BYTE, r)) : (e.texture = a.createTexture(), a.bindTexture(a.TEXTURE_2D, e.texture), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR_MIPMAP_NEAREST), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, r), e.texture.size = r.width), a.generateMipmap(a.TEXTURE_2D), this.map.animationLoop.set(this.map.style.rasterFadeDuration), e.state = "loaded", t(null) } }
                    var r = normalizeURL(e.coord.url(this.tiles, null, this.scheme), this.url, this.tileSize);
                    e.request = ajax.getImage(r, i.bind(this)) }, abortTile: function(e) { e.request && (e.request.abort(), delete e.request) }, unloadTile: function(e) { e.texture && this.map.painter.saveTileTexture(e.texture) } });
        }, { "../util/ajax": 104, "../util/evented": 113, "../util/mapbox": 119, "../util/util": 122, "./load_tilejson": 39 }],
        43: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                sourceTypes = { vector: require("../source/vector_tile_source"), raster: require("../source/raster_tile_source"), geojson: require("../source/geojson_source"), video: require("../source/video_source"), image: require("../source/image_source") };
            exports.create = function(e, r, o, t) {
                if (r = new sourceTypes[r.type](e, r, o, t), r.setEventedParent(t), r.id !== e) throw new Error("Expected Source id to be " + e + " instead of " + r.id);
                return util.bindAll(["load", "abort", "unload", "serialize", "prepare"], r), r }, exports.getType = function(e) {
                return sourceTypes[e] }, exports.setType = function(e, r) { sourceTypes[e] = r };
        }, { "../source/geojson_source": 35, "../source/image_source": 38, "../source/raster_tile_source": 42, "../source/vector_tile_source": 47, "../source/video_source": 49, "../util/util": 122 }],
        44: [function(require, module, exports) {
            "use strict";

            function SourceCache(e, i, t) { this.id = e, this.dispatcher = t, this._source = Source.create(e, i, t, this), this.on("source.load", function() { this.map && this._source.onAdd && this._source.onAdd(this.map), this._sourceLoaded = !0 }), this.on("error", function() { this._sourceErrored = !0 }), this.on("data", function(e) { this._sourceLoaded && "source" === e.dataType && (this.reload(), this.transform && this.update(this.transform, this.map && this.map.style.rasterFadeDuration)) }), this._tiles = {}, this._cache = new Cache(0, this.unloadTile.bind(this)), this._isIdRenderable = this._isIdRenderable.bind(this) }

            function coordinateToTilePoint(e, i, t) {
                var o = t.zoomTo(Math.min(e.z, i));
                return { x: (o.column - (e.x + e.w * Math.pow(2, e.z))) * EXTENT, y: (o.row - e.y) * EXTENT } }

            function compareKeyZoom(e, i) {
                return e % 32 - i % 32 }
            var Source = require("./source"),
                Tile = require("./tile"),
                Evented = require("../util/evented"),
                TileCoord = require("./tile_coord"),
                Cache = require("../util/lru_cache"),
                Coordinate = require("../geo/coordinate"),
                util = require("../util/util"),
                EXTENT = require("../data/bucket").EXTENT;
            module.exports = SourceCache, SourceCache.maxOverzooming = 10, SourceCache.maxUnderzooming = 3, SourceCache.prototype = util.inherit(Evented, { onAdd: function(e) { this.map = e, this._source && this._source.onAdd && this._source.onAdd(e) }, loaded: function() {
                    if (this._sourceErrored) return !0;
                    if (!this._sourceLoaded) return !1;
                    for (var e in this._tiles) {
                        var i = this._tiles[e];
                        if ("loaded" !== i.state && "errored" !== i.state) return !1 }
                    return !0 }, getSource: function() {
                    return this._source }, loadTile: function(e, i) {
                    return this._source.loadTile(e, i) }, unloadTile: function(e) {
                    if (this._source.unloadTile) return this._source.unloadTile(e) }, abortTile: function(e) {
                    if (this._source.abortTile) return this._source.abortTile(e) }, serialize: function() {
                    return this._source.serialize() }, prepare: function() {
                    if (this._sourceLoaded && this._source.prepare) return this._source.prepare() }, getIds: function() {
                    return Object.keys(this._tiles).map(Number).sort(compareKeyZoom) }, getRenderableIds: function() {
                    return this.getIds().filter(this._isIdRenderable) }, _isIdRenderable: function(e) {
                    return this._tiles[e].hasData() && !this._coveredTiles[e] }, reload: function() { this._cache.reset();
                    for (var e in this._tiles) {
                        var i = this._tiles[e]; "loading" !== i.state && (i.state = "reloading"), this.loadTile(this._tiles[e], this._tileLoaded.bind(this, this._tiles[e])) } }, _tileLoaded: function(e, i) {
                    return i ? (e.state = "errored", void this._source.fire("error", { tile: e, error: i })) : (e.sourceCache = this, e.timeAdded = (new Date).getTime(), this._source.fire("data", { tile: e, dataType: "tile" }), void(this.map && (this.map.painter.tileExtentVAO.vao = null))) }, getTile: function(e) {
                    return this.getTileByID(e.id) }, getTileByID: function(e) {
                    return this._tiles[e] }, getZoom: function(e) {
                    return e.zoom + e.scaleZoom(e.tileSize / this._source.tileSize) }, findLoadedChildren: function(e, i, t) {
                    var o = !1;
                    for (var r in this._tiles) {
                        var s = this._tiles[r];
                        if (!(t[r] || !s.hasData() || s.coord.z <= e.z || s.coord.z > i)) {
                            var a = Math.pow(2, Math.min(s.coord.z, this._source.maxzoom) - Math.min(e.z, this._source.maxzoom));
                            if (Math.floor(s.coord.x / a) === e.x && Math.floor(s.coord.y / a) === e.y)
                                for (t[r] = !0, o = !0; s && s.coord.z - 1 > e.z;) {
                                    var n = s.coord.parent(this._source.maxzoom).id;
                                    s = this._tiles[n], s && s.hasData() && (delete t[r], t[n] = !0) } } }
                    return o }, findLoadedParent: function(e, i, t) {
                    for (var o = e.z - 1; o >= i; o--) { e = e.parent(this._source.maxzoom);
                        var r = this._tiles[e.id];
                        if (r && r.hasData()) return t[e.id] = !0, r;
                        if (this._cache.has(e.id)) return this.addTile(e), t[e.id] = !0, this._tiles[e.id] } }, updateCacheSize: function(e) {
                    var i = Math.ceil(e.width / e.tileSize) + 1,
                        t = Math.ceil(e.height / e.tileSize) + 1,
                        o = i * t,
                        r = 5;
                    this._cache.setMaxSize(Math.floor(o * r)) }, update: function(e, i) {
                    if (this._sourceLoaded) {
                        var t, o, r;
                        this.updateCacheSize(e);
                        var s = (this._source.roundZoom ? Math.round : Math.floor)(this.getZoom(e)),
                            a = Math.max(s - SourceCache.maxOverzooming, this._source.minzoom),
                            n = Math.max(s + SourceCache.maxUnderzooming, this._source.minzoom),
                            h = {},
                            d = (new Date).getTime();
                        this._coveredTiles = {};
                        var c;
                        for (c = this.used ? this._source.coord ? [this._source.coord] : e.coveringTiles({ tileSize: this._source.tileSize, minzoom: this._source.minzoom, maxzoom: this._source.maxzoom, roundZoom: this._source.roundZoom, reparseOverscaled: this._source.reparseOverscaled }) : [], t = 0; t < c.length; t++) o = c[t], r = this.addTile(o), h[o.id] = !0, r.hasData() || this.findLoadedChildren(o, n, h) || this.findLoadedParent(o, a, h);
                        for (var u = {}, l = Object.keys(h), m = 0; m < l.length; m++) {
                            var _ = l[m];
                            o = TileCoord.fromID(_), r = this._tiles[_], r && r.timeAdded > d - (i || 0) && (this.findLoadedChildren(o, n, h) && (h[_] = !0), this.findLoadedParent(o, a, u)) }
                        var f;
                        for (f in u) h[f] || (this._coveredTiles[f] = !0);
                        for (f in u) h[f] = !0;
                        var T = util.keysDifference(this._tiles, h);
                        for (t = 0; t < T.length; t++) this.removeTile(+T[t]);
                        this.transform = e } }, addTile: function(e) {
                    var i = this._tiles[e.id];
                    if (i) return i;
                    var t = e.wrapped();
                    if (i = this._tiles[t.id], i || (i = this._cache.get(t.id), i && this._redoPlacement && this._redoPlacement(i)), !i) {
                        var o = e.z,
                            r = o > this._source.maxzoom ? Math.pow(2, o - this._source.maxzoom) : 1;
                        i = new Tile(t, this._source.tileSize * r, this._source.maxzoom), this.loadTile(i, this._tileLoaded.bind(this, i)) }
                    return i.uses++, this._tiles[e.id] = i, this._source.fire("dataloading", { tile: i, dataType: "tile" }), i }, removeTile: function(e) {
                    var i = this._tiles[e];
                    i && (i.uses--, delete this._tiles[e], this._source.fire("data", { tile: i, dataType: "tile" }), i.uses > 0 || (i.hasData() ? this._cache.add(i.coord.wrapped().id, i) : (i.aborted = !0, this.abortTile(i), this.unloadTile(i)))) }, clearTiles: function() {
                    for (var e in this._tiles) this.removeTile(e);
                    this._cache.reset() }, tilesIn: function(e) {
                    for (var i = {}, t = this.getIds(), o = 1 / 0, r = 1 / 0, s = -(1 / 0), a = -(1 / 0), n = e[0].zoom, h = 0; h < e.length; h++) {
                        var d = e[h];
                        o = Math.min(o, d.column), r = Math.min(r, d.row), s = Math.max(s, d.column), a = Math.max(a, d.row) }
                    for (var c = 0; c < t.length; c++) {
                        var u = this._tiles[t[c]],
                            l = TileCoord.fromID(t[c]),
                            m = [coordinateToTilePoint(l, u.sourceMaxZoom, new Coordinate(o, r, n)), coordinateToTilePoint(l, u.sourceMaxZoom, new Coordinate(s, a, n))];
                        if (m[0].x < EXTENT && m[0].y < EXTENT && m[1].x >= 0 && m[1].y >= 0) {
                            for (var _ = [], f = 0; f < e.length; f++) _.push(coordinateToTilePoint(l, u.sourceMaxZoom, e[f]));
                            var T = i[u.coord.id];
                            void 0 === T && (T = i[u.coord.id] = { tile: u, coord: l, queryGeometry: [], scale: Math.pow(2, this.transform.zoom - u.coord.z) }), T.queryGeometry.push(_) } }
                    var v = [];
                    for (var p in i) v.push(i[p]);
                    return v }, redoPlacement: function() {
                    for (var e = this.getIds(), i = 0; i < e.length; i++) {
                        var t = this.getTileByID(e[i]);
                        t.redoPlacement(this) } }, getVisibleCoordinates: function() {
                    return this.getRenderableIds().map(TileCoord.fromID) } });
        }, { "../data/bucket": 2, "../geo/coordinate": 12, "../util/evented": 113, "../util/lru_cache": 118, "../util/util": 122, "./source": 43, "./tile": 45, "./tile_coord": 46 }],
        45: [function(require, module, exports) {
            "use strict";

            function Tile(e, t, i) { this.coord = e, this.uid = util.uniqueId(), this.uses = 0, this.tileSize = t, this.sourceMaxZoom = i, this.buckets = {}, this.state = "loading" }

            function unserializeBuckets(e, t) {
                if (t) {
                    for (var i = {}, s = 0; s < e.length; s++) {
                        var r = t.getLayer(e[s].layerId);
                        if (r) {
                            var o = Bucket.create(util.extend({ layer: r, childLayers: e[s].childLayerIds.map(t.getLayer.bind(t)).filter(function(e) {
                                    return e }) }, e[s]));
                            i[o.id] = o } }
                    return i } }
            var util = require("../util/util"),
                Bucket = require("../data/bucket"),
                FeatureIndex = require("../data/feature_index"),
                vt = require("vector-tile"),
                Protobuf = require("pbf"),
                GeoJSONFeature = require("../util/vectortile_to_geojson"),
                featureFilter = require("feature-filter"),
                CollisionTile = require("../symbol/collision_tile"),
                CollisionBoxArray = require("../symbol/collision_box"),
                SymbolInstancesArray = require("../symbol/symbol_instances"),
                SymbolQuadsArray = require("../symbol/symbol_quads");
            module.exports = Tile, Tile.prototype = { loadVectorData: function(e, t) { this.hasData() && this.unloadVectorData(t), this.state = "loaded", e && (e.rawTileData && (this.rawTileData = e.rawTileData), this.collisionBoxArray = new CollisionBoxArray(e.collisionBoxArray), this.collisionTile = new CollisionTile(e.collisionTile, this.collisionBoxArray), this.symbolInstancesArray = new SymbolInstancesArray(e.symbolInstancesArray), this.symbolQuadsArray = new SymbolQuadsArray(e.symbolQuadsArray), this.featureIndex = new FeatureIndex(e.featureIndex, this.rawTileData, this.collisionTile), this.buckets = unserializeBuckets(e.buckets, t.style)) }, reloadSymbolData: function(e, t) {
                    if ("unloaded" !== this.state) { this.collisionTile = new CollisionTile(e.collisionTile, this.collisionBoxArray), this.featureIndex.setCollisionTile(this.collisionTile);
                        for (var i in this.buckets) {
                            var s = this.buckets[i]; "symbol" === s.type && (s.destroy(), delete this.buckets[i]) }
                        util.extend(this.buckets, unserializeBuckets(e.buckets, t)) } }, unloadVectorData: function() {
                    for (var e in this.buckets) this.buckets[e].destroy();
                    this.collisionBoxArray = null, this.symbolQuadsArray = null, this.symbolInstancesArray = null, this.collisionTile = null, this.featureIndex = null, this.buckets = null, this.state = "unloaded" }, redoPlacement: function(e) {
                    function t(t, i) { this.reloadSymbolData(i, e.map.style), e.fire("data", { tile: this, dataType: "tile" }), e.map && (e.map.painter.tileExtentVAO.vao = null), this.state = "loaded", this.redoWhenDone && (this.redoPlacement(e), this.redoWhenDone = !1) }
                    return "loaded" !== this.state || "reloading" === this.state ? void(this.redoWhenDone = !0) : (this.state = "reloading", void e.dispatcher.send("redo placement", { uid: this.uid, source: e.id, angle: e.map.transform.angle, pitch: e.map.transform.pitch, showCollisionBoxes: e.map.showCollisionBoxes }, t.bind(this), this.workerID)) }, getBucket: function(e) {
                    return this.buckets && this.buckets[e.ref || e.id] }, querySourceFeatures: function(e, t) {
                    if (this.rawTileData) { this.vtLayers || (this.vtLayers = new vt.VectorTile(new Protobuf(this.rawTileData)).layers);
                        var i = this.vtLayers._geojsonTileLayer || this.vtLayers[t.sourceLayer];
                        if (i)
                            for (var s = featureFilter(t.filter), r = { z: this.coord.z, x: this.coord.x, y: this.coord.y }, o = 0; o < i.length; o++) {
                                var a = i.feature(o);
                                if (s(a)) {
                                    var l = new GeoJSONFeature(a, this.coord.z, this.coord.x, this.coord.y);
                                    l.tile = r, e.push(l) } } } }, hasData: function() {
                    return "loaded" === this.state || "reloading" === this.state } };
        }, { "../data/bucket": 2, "../data/feature_index": 10, "../symbol/collision_box": 72, "../symbol/collision_tile": 74, "../symbol/symbol_instances": 83, "../symbol/symbol_quads": 84, "../util/util": 122, "../util/vectortile_to_geojson": 123, "feature-filter": 138, "pbf": 190, "vector-tile": 202 }],
        46: [function(require, module, exports) {
            "use strict";

            function TileCoord(t, i, o, r) { isNaN(r) && (r = 0), this.z = +t, this.x = +i, this.y = +o, this.w = +r, r *= 2, r < 0 && (r = r * -1 - 1);
                var e = 1 << this.z;
                this.id = 32 * (e * e * r + e * this.y + this.x) + this.z, this.posMatrix = null }

            function getQuadkey(t, i, o) {
                for (var r, e = "", n = t; n > 0; n--) r = 1 << n - 1, e += (i & r ? 1 : 0) + (o & r ? 2 : 0);
                return e }

            function edge(t, i) {
                if (t.row > i.row) {
                    var o = t;
                    t = i, i = o }
                return { x0: t.column, y0: t.row, x1: i.column, y1: i.row, dx: i.column - t.column, dy: i.row - t.row } }

            function scanSpans(t, i, o, r, e) {
                var n = Math.max(o, Math.floor(i.y0)),
                    h = Math.min(r, Math.ceil(i.y1));
                if (t.x0 === i.x0 && t.y0 === i.y0 ? t.x0 + i.dy / t.dy * t.dx < i.x1 : t.x1 - i.dy / t.dy * t.dx < i.x0) {
                    var s = t;
                    t = i, i = s }
                for (var a = t.dx / t.dy, d = i.dx / i.dy, y = t.dx > 0, l = i.dx < 0, u = n; u < h; u++) {
                    var x = a * Math.max(0, Math.min(t.dy, u + y - t.y0)) + t.x0,
                        c = d * Math.max(0, Math.min(i.dy, u + l - i.y0)) + i.x0;
                    e(Math.floor(c), Math.ceil(x), u) } }

            function scanTriangle(t, i, o, r, e, n) {
                var h, s = edge(t, i),
                    a = edge(i, o),
                    d = edge(o, t);
                s.dy > a.dy && (h = s, s = a, a = h), s.dy > d.dy && (h = s, s = d, d = h), a.dy > d.dy && (h = a, a = d, d = h), s.dy && scanSpans(d, s, r, e, n), a.dy && scanSpans(d, a, r, e, n) }
            var WhooTS = require("whoots-js"),
                Coordinate = require("../geo/coordinate");
            module.exports = TileCoord, TileCoord.prototype.toString = function() {
                return this.z + "/" + this.x + "/" + this.y }, TileCoord.prototype.toCoordinate = function(t) {
                var i = Math.min(this.z, t),
                    o = Math.pow(2, i),
                    r = this.y,
                    e = this.x + o * this.w;
                return new Coordinate(e, r, i) }, TileCoord.fromID = function(t) {
                var i = t % 32,
                    o = 1 << i,
                    r = (t - i) / 32,
                    e = r % o,
                    n = (r - e) / o % o,
                    h = Math.floor(r / (o * o));
                return h % 2 !== 0 && (h = h * -1 - 1), h /= 2, new TileCoord(i, e, n, h) }, TileCoord.prototype.url = function(t, i, o) {
                var r = WhooTS.getTileBBox(this.x, this.y, this.z),
                    e = getQuadkey(this.z, this.x, this.y);
                return t[(this.x + this.y) % t.length].replace("{prefix}", (this.x % 16).toString(16) + (this.y % 16).toString(16)).replace("{z}", Math.min(this.z, i || this.z)).replace("{x}", this.x).replace("{y}", "tms" === o ? Math.pow(2, this.z) - this.y - 1 : this.y).replace("{quadkey}", e).replace("{bbox-epsg-3857}", r) }, TileCoord.prototype.parent = function(t) {
                return 0 === this.z ? null : this.z > t ? new TileCoord(this.z - 1, this.x, this.y, this.w) : new TileCoord(this.z - 1, Math.floor(this.x / 2), Math.floor(this.y / 2), this.w) }, TileCoord.prototype.wrapped = function() {
                return new TileCoord(this.z, this.x, this.y, 0) }, TileCoord.prototype.children = function(t) {
                if (this.z >= t) return [new TileCoord(this.z + 1, this.x, this.y, this.w)];
                var i = this.z + 1,
                    o = 2 * this.x,
                    r = 2 * this.y;
                return [new TileCoord(i, o, r, this.w), new TileCoord(i, o + 1, r, this.w), new TileCoord(i, o, r + 1, this.w), new TileCoord(i, o + 1, r + 1, this.w)] }, TileCoord.cover = function(t, i, o) {
                function r(t, i, r) {
                    var h, s, a;
                    if (r >= 0 && r <= e)
                        for (h = t; h < i; h++) s = (h % e + e) % e, a = new TileCoord(o, s, r, Math.floor(h / e)), n[a.id] = a }
                var e = 1 << t,
                    n = {};
                return scanTriangle(i[0], i[1], i[2], 0, e, r), scanTriangle(i[2], i[3], i[0], 0, e, r), Object.keys(n).map(function(t) {
                    return n[t] }) };
        }, { "../geo/coordinate": 12, "whoots-js": 210 }],
        47: [function(require, module, exports) {
            "use strict";

            function VectorTileSource(e, i, t, o) {
                if (this.id = e, this.dispatcher = t, util.extend(this, util.pick(i, ["url", "scheme", "tileSize"])), this._options = util.extend({ type: "vector" }, i), 512 !== this.tileSize) throw new Error("vector tile sources must have a tileSize of 512");
                this.setEventedParent(o), this.fire("dataloading", { dataType: "source" }), loadTileJSON(i, function(e, i) {
                    return e ? void this.fire("error", e) : (util.extend(this, i), this.fire("data", { dataType: "source" }), void this.fire("source.load")) }.bind(this)) }
            var Evented = require("../util/evented"),
                util = require("../util/util"),
                loadTileJSON = require("./load_tilejson"),
                normalizeURL = require("../util/mapbox").normalizeTileURL;
            module.exports = VectorTileSource, VectorTileSource.prototype = util.inherit(Evented, { minzoom: 0, maxzoom: 22, scheme: "xyz", tileSize: 512, reparseOverscaled: !0, isTileClipped: !0, onAdd: function(e) { this.map = e }, serialize: function() {
                    return util.extend({}, this._options) }, loadTile: function(e, i) {
                    function t(t, o) {
                        if (!e.aborted) {
                            if (t) return i(t);
                            e.loadVectorData(o, this.map.painter), e.redoWhenDone && (e.redoWhenDone = !1, e.redoPlacement(this)), i(null), e.reloadCallback && (this.loadTile(e, e.reloadCallback), e.reloadCallback = null) } }
                    var o = e.coord.z > this.maxzoom ? Math.pow(2, e.coord.z - this.maxzoom) : 1,
                        r = { url: normalizeURL(e.coord.url(this.tiles, this.maxzoom, this.scheme), this.url), uid: e.uid, coord: e.coord, zoom: e.coord.z, tileSize: this.tileSize * o, source: this.id, overscaling: o, angle: this.map.transform.angle, pitch: this.map.transform.pitch, showCollisionBoxes: this.map.showCollisionBoxes };
                    e.workerID ? "loading" === e.state ? e.reloadCallback = i : this.dispatcher.send("reload tile", r, t.bind(this), e.workerID) : e.workerID = this.dispatcher.send("load tile", r, t.bind(this)) }, abortTile: function(e) { this.dispatcher.send("abort tile", { uid: e.uid, source: this.id }, null, e.workerID) }, unloadTile: function(e) { e.unloadVectorData(), this.dispatcher.send("remove tile", { uid: e.uid, source: this.id }, null, e.workerID) } });
        }, { "../util/evented": 113, "../util/mapbox": 119, "../util/util": 122, "./load_tilejson": 39 }],
        48: [function(require, module, exports) {
            "use strict";

            function VectorTileWorkerSource(e, r, t) { this.actor = e, this.styleLayers = r, t && (this.loadVectorData = t), this.loading = {}, this.loaded = {} }
            var ajax = require("../util/ajax"),
                vt = require("vector-tile"),
                Protobuf = require("pbf"),
                WorkerTile = require("./worker_tile"),
                util = require("../util/util");
            module.exports = VectorTileWorkerSource, VectorTileWorkerSource.prototype = { loadTile: function(e, r) {
                    function t(e, t) {
                        return delete this.loading[i][o], e ? r(e) : t ? (a.vectorTile = t, a.parse(t, this.styleLayers.getLayerFamilies(), this.actor, function(e, i, o) {
                            return e ? r(e) : void r(null, util.extend({ rawTileData: t.rawData }, i), o) }), this.loaded[i] = this.loaded[i] || {}, void(this.loaded[i][o] = a)) : r(null, null) }
                    var i = e.source,
                        o = e.uid;
                    this.loading[i] || (this.loading[i] = {});
                    var a = this.loading[i][o] = new WorkerTile(e);
                    a.abort = this.loadVectorData(e, t.bind(this)) }, reloadTile: function(e, r) {
                    var t = this.loaded[e.source],
                        i = e.uid;
                    if (t && t[i]) {
                        var o = t[i];
                        o.parse(o.vectorTile, this.styleLayers.getLayerFamilies(), this.actor, r) } }, abortTile: function(e) {
                    var r = this.loading[e.source],
                        t = e.uid;
                    r && r[t] && r[t].abort && (r[t].abort(), delete r[t]) }, removeTile: function(e) {
                    var r = this.loaded[e.source],
                        t = e.uid;
                    r && r[t] && delete r[t] }, loadVectorData: function(e, r) {
                    function t(e, t) {
                        if (e) return r(e);
                        var i = new vt.VectorTile(new Protobuf(t));
                        i.rawData = t, r(e, i) }
                    var i = ajax.getArrayBuffer(e.url, t.bind(this));
                    return function() { i.abort() } }, redoPlacement: function(e, r) {
                    var t = this.loaded[e.source],
                        i = this.loading[e.source],
                        o = e.uid;
                    if (t && t[o]) {
                        var a = t[o],
                            l = a.redoPlacement(e.angle, e.pitch, e.showCollisionBoxes);
                        l.result && r(null, l.result, l.transferables) } else i && i[o] && (i[o].angle = e.angle) } };
        }, { "../util/ajax": 104, "../util/util": 122, "./worker_tile": 51, "pbf": 190, "vector-tile": 202 }],
        49: [function(require, module, exports) {
            "use strict";

            function VideoSource(i, e, t, o) { this.id = i, this.urls = e.urls, this.coordinates = e.coordinates, this.setEventedParent(o), this.fire("dataloading", { dataType: "source" }), ajax.getVideo(e.urls, function(i, t) {
                    if (i) return this.fire("error", { error: i });
                    this.video = t, this.video.loop = !0;
                    var o;
                    this.video.addEventListener("playing", function() { o = this.map.style.animationLoop.set(1 / 0), this.map._rerender() }.bind(this)), this.video.addEventListener("pause", function() { this.map.style.animationLoop.cancel(o) }.bind(this)), this.map && (this.video.play(), this.setCoordinates(e.coordinates)), this.fire("data", { dataType: "source" }), this.fire("source.load") }.bind(this)) }
            var util = require("../util/util"),
                ajax = require("../util/ajax"),
                ImageSource = require("./image_source");
            module.exports = VideoSource, VideoSource.prototype = util.inherit(ImageSource, { roundZoom: !0, getVideo: function() {
                    return this.video }, onAdd: function(i) { this.map || (this.map = i, this.video && (this.video.play(), this.setCoordinates(this.coordinates))) }, prepare: function() {!this.tile || this.video.readyState < 2 || this._prepareImage(this.map.painter.gl, this.video) }, serialize: function() {
                    return { type: "video", urls: this.urls, coordinates: this.coordinates } } });
        }, { "../util/ajax": 104, "../util/util": 122, "./image_source": 38 }],
        50: [function(require, module, exports) {
            "use strict";

            function Worker(e) { this.self = e, this.actor = new Actor(e, this), this.layers = {}, this.layerFamilies = {}, this.workerSourceTypes = { vector: VectorTileWorkerSource, geojson: GeoJSONWorkerSource }, this.workerSources = {}, this.self.registerWorkerSource = function(e, r) {
                    if (this.workerSourceTypes[e]) throw new Error('Worker source with name "' + e + '" already registered.');
                    this.workerSourceTypes[e] = r }.bind(this) }

            function createLayerFamilies(e) {
                var r = {};
                for (var t in e) {
                    var i = e[t],
                        o = i.ref || i.id,
                        s = e[o];
                    s.layout && "none" === s.layout.visibility || (r[o] = r[o] || [], t === o ? r[o].unshift(i) : r[o].push(i)) }
                return r }
            var Actor = require("../util/actor"),
                StyleLayer = require("../style/style_layer"),
                util = require("../util/util"),
                VectorTileWorkerSource = require("./vector_tile_worker_source"),
                GeoJSONWorkerSource = require("./geojson_worker_source"),
                featureFilter = require("feature-filter");
            module.exports = function(e) {
                return new Worker(e) }, util.extend(Worker.prototype, { "set layers": function(e, r) {
                    function t(e) {
                        var r = StyleLayer.create(e, e.ref && i[e.ref]);
                        r.updatePaintTransitions({}, { transition: !1 }), r.filter = featureFilter(r.filter), i[r.id] = r }
                    for (var i = this.layers[e] = {}, o = [], s = 0; s < r.length; s++) {
                        var a = r[s]; "fill" !== a.type && "line" !== a.type && "circle" !== a.type && "symbol" !== a.type || (a.ref ? o.push(s) : t(a)) }
                    for (var n = 0; n < o.length; n++) t(r[o[n]]);
                    this.layerFamilies[e] = createLayerFamilies(this.layers[e]) }, "update layers": function(e, r) {
                    function t(e) {
                        var r = s[e.ref],
                            t = s[e.id];
                        t ? t.set(e, r) : t = s[e.id] = StyleLayer.create(e, r), t.updatePaintTransitions({}, { transition: !1 }), t.filter = featureFilter(t.filter) }
                    var i, o, s = this.layers[e];
                    for (i in r) o = r[i], o.ref && t(o);
                    for (i in r) o = r[i], o.ref || t(o);
                    this.layerFamilies[e] = createLayerFamilies(this.layers[e]) }, "load tile": function(e, r, t) {
                    var i = r.type || "vector";
                    this.getWorkerSource(e, i).loadTile(r, t) }, "reload tile": function(e, r, t) {
                    var i = r.type || "vector";
                    this.getWorkerSource(e, i).reloadTile(r, t) }, "abort tile": function(e, r) {
                    var t = r.type || "vector";
                    this.getWorkerSource(e, t).abortTile(r) }, "remove tile": function(e, r) {
                    var t = r.type || "vector";
                    this.getWorkerSource(e, t).removeTile(r) }, "redo placement": function(e, r, t) {
                    var i = r.type || "vector";
                    this.getWorkerSource(e, i).redoPlacement(r, t) }, "load worker source": function(e, r, t) {
                    try { this.self.importScripts(r.url), t() } catch (e) { t(e) } }, getWorkerSource: function(e, r) {
                    if (this.workerSources[e] || (this.workerSources[e] = {}), !this.workerSources[e][r]) {
                        var t = { getLayers: function() {
                                    return this.layers[e] }.bind(this), getLayerFamilies: function() {
                                    return this.layerFamilies[e] }.bind(this) },
                            i = { send: function(r, t, i, o) { this.actor.send(r, t, i, o, e) }.bind(this) };
                        this.workerSources[e][r] = new this.workerSourceTypes[r](i, t) }
                    return this.workerSources[e][r] } });
        }, { "../style/style_layer": 59, "../util/actor": 103, "../util/util": 122, "./geojson_worker_source": 36, "./vector_tile_worker_source": 48, "feature-filter": 138 }],
        51: [function(require, module, exports) {
            "use strict";

            function WorkerTile(e) { this.coord = e.coord, this.uid = e.uid, this.zoom = e.zoom, this.tileSize = e.tileSize, this.source = e.source, this.overscaling = e.overscaling, this.angle = e.angle, this.pitch = e.pitch, this.showCollisionBoxes = e.showCollisionBoxes }

            function isBucketNonEmpty(e) {
                return !e.isEmpty() }

            function serializeBucket(e) {
                return e.serialize() }

            function getTransferables(e) {
                var r = [];
                for (var s in e) e[s].getTransferables(r);
                return r }

            function getLayerId(e) {
                return e.id }
            var FeatureIndex = require("../data/feature_index"),
                CollisionTile = require("../symbol/collision_tile"),
                Bucket = require("../data/bucket"),
                CollisionBoxArray = require("../symbol/collision_box"),
                DictionaryCoder = require("../util/dictionary_coder"),
                util = require("../util/util"),
                SymbolInstancesArray = require("../symbol/symbol_instances"),
                SymbolQuadsArray = require("../symbol/symbol_quads");
            module.exports = WorkerTile, WorkerTile.prototype.parse = function(e, r, s, i) {
                function o(e, r) {
                    for (var s = 0; s < e.length; s++) {
                        var i = e.feature(s);
                        i.index = s;
                        for (var o in r) r[o].layer.filter(i) && r[o].features.push(i) } }

                function t(e) {
                    if (e) return i(e);
                    if (T++, 2 === T) {
                        for (var r = A.length - 1; r >= 0; r--) a(m, A[r]);
                        n() } }

                function a(e, r) {
                    if (r.populateArrays(h, I, z), "symbol" !== r.type)
                        for (var s = 0; s < r.features.length; s++) {
                            var i = r.features[s];
                            d.insert(i, i.index, r.sourceLayerIndex, r.index) }
                    r.features = null }

                function n() { m.status = "done", m.redoPlacementAfterDone && (m.redoPlacement(m.angle, m.pitch, null), m.redoPlacementAfterDone = !1);
                    var e = d.serialize(),
                        r = h.serialize(),
                        s = m.collisionBoxArray.serialize(),
                        o = m.symbolInstancesArray.serialize(),
                        t = m.symbolQuadsArray.serialize(),
                        a = x.filter(isBucketNonEmpty);
                    i(null, { buckets: a.map(serializeBucket), featureIndex: e.data, collisionTile: r.data, collisionBoxArray: s, symbolInstancesArray: o, symbolQuadsArray: t }, getTransferables(a).concat(e.transferables).concat(r.transferables)) }
                this.status = "parsing", this.data = e, this.collisionBoxArray = new CollisionBoxArray, this.symbolInstancesArray = new SymbolInstancesArray, this.symbolQuadsArray = new SymbolQuadsArray;
                var l, u, c, y, h = new CollisionTile(this.angle, this.pitch, this.collisionBoxArray),
                    d = new FeatureIndex(this.coord, this.overscaling, h, e.layers),
                    f = new DictionaryCoder(e.layers ? Object.keys(e.layers).sort() : ["_geojsonTileLayer"]),
                    m = this,
                    b = {},
                    g = {},
                    p = 0;
                for (var v in r) u = r[v][0], u.source === this.source && (u.ref || u.minzoom && this.zoom < u.minzoom || u.maxzoom && this.zoom >= u.maxzoom || u.layout && "none" === u.layout.visibility || e.layers && !e.layers[u.sourceLayer] || (y = Bucket.create({ layer: u, index: p++, childLayers: r[v], zoom: this.zoom, overscaling: this.overscaling, showCollisionBoxes: this.showCollisionBoxes, collisionBoxArray: this.collisionBoxArray, symbolQuadsArray: this.symbolQuadsArray, symbolInstancesArray: this.symbolInstancesArray, sourceLayerIndex: f.encode(u.sourceLayer || "_geojsonTileLayer") }), b[u.id] = y, e.layers && (c = u.sourceLayer, g[c] = g[c] || {}, g[c][u.id] = y)));
                if (e.layers)
                    for (c in g) 1 === u.version && util.warnOnce('Vector tile source "' + this.source + '" layer "' + c + '" does not use vector tile spec v2 and therefore may have some rendering errors.'), u = e.layers[c], u && o(u, g[c]);
                else o(e, b);
                var x = [],
                    A = this.symbolBuckets = [],
                    k = [];
                d.bucketLayerIDs = {};
                for (var B in b) y = b[B], 0 !== y.features.length && (d.bucketLayerIDs[y.index] = y.childLayers.map(getLayerId), x.push(y), "symbol" === y.type ? A.push(y) : k.push(y));
                var z = {},
                    I = {},
                    T = 0;
                if (A.length > 0) {
                    for (l = A.length - 1; l >= 0; l--) A[l].updateIcons(z), A[l].updateFont(I);
                    for (var L in I) I[L] = Object.keys(I[L]).map(Number);
                    z = Object.keys(z), s.send("get glyphs", { uid: this.uid, stacks: I }, function(e, r) { I = r, t(e) }), z.length ? s.send("get icons", { icons: z }, function(e, r) { z = r, t(e) }) : t() }
                for (l = k.length - 1; l >= 0; l--) a(this, k[l]);
                if (0 === A.length) return n() }, WorkerTile.prototype.redoPlacement = function(e, r, s) {
                if ("done" !== this.status) return this.redoPlacementAfterDone = !0, this.angle = e, {};
                for (var i = new CollisionTile(e, r, this.collisionBoxArray), o = this.symbolBuckets, t = o.length - 1; t >= 0; t--) o[t].placeFeatures(i, s);
                var a = i.serialize(),
                    n = o.filter(isBucketNonEmpty);
                return { result: { buckets: n.map(serializeBucket), collisionTile: a.data }, transferables: getTransferables(n).concat(a.transferables) } };
        }, { "../data/bucket": 2, "../data/feature_index": 10, "../symbol/collision_box": 72, "../symbol/collision_tile": 74, "../symbol/symbol_instances": 83, "../symbol/symbol_quads": 84, "../util/dictionary_coder": 110, "../util/util": 122 }],
        52: [function(require, module, exports) {
            "use strict";

            function AnimationLoop() { this.n = 0, this.times = [] }
            module.exports = AnimationLoop, AnimationLoop.prototype.stopped = function() {
                return this.times = this.times.filter(function(t) {
                    return t.time >= (new Date).getTime() }), !this.times.length }, AnimationLoop.prototype.set = function(t) {
                return this.times.push({ id: this.n, time: t + (new Date).getTime() }), this.n++ }, AnimationLoop.prototype.cancel = function(t) { this.times = this.times.filter(function(i) {
                    return i.id !== t }) };
        }, {}],
        53: [function(require, module, exports) {
            "use strict";

            function ImageSprite(t) { this.base = t, this.retina = browser.devicePixelRatio > 1;
                var i = this.retina ? "@2x" : "";
                ajax.getJSON(normalizeURL(t, i, ".json"), function(t, i) {
                    return t ? void this.fire("error", { error: t }) : (this.data = i, void(this.img && this.fire("data", { dataType: "style" }))) }.bind(this)), ajax.getImage(normalizeURL(t, i, ".png"), function(t, i) {
                    if (t) return void this.fire("error", { error: t });
                    for (var e = i.getData(), r = i.data = new Uint8Array(e.length), a = 0; a < e.length; a += 4) {
                        var o = e[a + 3] / 255;
                        r[a + 0] = e[a + 0] * o, r[a + 1] = e[a + 1] * o, r[a + 2] = e[a + 2] * o, r[a + 3] = e[a + 3] }
                    this.img = i, this.data && this.fire("data", { dataType: "style" }) }.bind(this)) }

            function SpritePosition() {}
            var Evented = require("../util/evented"),
                ajax = require("../util/ajax"),
                browser = require("../util/browser"),
                normalizeURL = require("../util/mapbox").normalizeSpriteURL;
            module.exports = ImageSprite, ImageSprite.prototype = Object.create(Evented), ImageSprite.prototype.toJSON = function() {
                return this.base }, ImageSprite.prototype.loaded = function() {
                return !(!this.data || !this.img) }, ImageSprite.prototype.resize = function() {
                if (browser.devicePixelRatio > 1 !== this.retina) {
                    var t = new ImageSprite(this.base);
                    t.on("data", function() { this.img = t.img, this.data = t.data, this.retina = t.retina }.bind(this)) } }, SpritePosition.prototype = { x: 0, y: 0, width: 0, height: 0, pixelRatio: 1, sdf: !1 }, ImageSprite.prototype.getSpritePosition = function(t) {
                if (!this.loaded()) return new SpritePosition;
                var i = this.data && this.data[t];
                return i && this.img ? i : new SpritePosition };
        }, { "../util/ajax": 104, "../util/browser": 105, "../util/evented": 113, "../util/mapbox": 119 }],
        54: [function(require, module, exports) {
            "use strict";

            function Light(t) { this.set(t) }
            var styleSpec = require("./style_spec"),
                util = require("../util/util"),
                Evented = require("../util/evented"),
                validateStyle = require("./validate_style"),
                StyleDeclaration = require("./style_declaration"),
                StyleTransition = require("./style_transition");
            module.exports = Light;
            var TRANSITION_SUFFIX = "-transition";
            Light.prototype = util.inherit(Evented, { properties: ["anchor", "color", "position", "intensity"], _specifications: styleSpec.$root.light, set: function(t) {
                    if (!this._validate(validateStyle.light, t)) { this._declarations = {}, this._transitions = {}, this._transitionOptions = {}, this.calculated = {}, t = util.extend({ anchor: this._specifications.anchor.default, color: this._specifications.color.default, position: this._specifications.position.default, intensity: this._specifications.intensity.default }, t);
                        for (var i in this.properties) {
                            var e = this.properties[i];
                            this._declarations[e] = new StyleDeclaration(this._specifications[e], t[e]) }
                        return this } }, getLight: function() {
                    return { anchor: this.getLightProperty("anchor"), color: this.getLightProperty("color"), position: this.getLightProperty("position"), intensity: this.getLightProperty("intensity") } }, getLightProperty: function(t) {
                    return util.endsWith(t, TRANSITION_SUFFIX) ? this._transitionOptions[t] : this._declarations[t] && this._declarations[t].value }, getLightValue: function(t, i) {
                    if ("position" === t) {
                        var e = this._transitions[t].calculate(i),
                            n = util.sphericalToCartesian(e);
                        return { x: n[0], y: n[1], z: n[2] } }
                    return this._transitions[t].calculate(i) }, setLight: function(t) {
                    if (!this._validate(validateStyle.light, t))
                        for (var i in t) {
                            var e = t[i];
                            util.endsWith(i, TRANSITION_SUFFIX) ? this._transitionOptions[i] = e : null === e || void 0 === e ? delete this._declarations[i] : this._declarations[i] = new StyleDeclaration(this._specifications[i], e) } }, recalculate: function(t, i) {
                    for (var e in this._declarations) this.calculated[e] = this.getLightValue(e, { zoom: t, zoomHistory: i }) }, _applyLightDeclaration: function(t, i, e, n, s) {
                    var a = e.transition ? this._transitions[t] : void 0,
                        o = this._specifications[t];
                    if (null !== i && void 0 !== i || (i = new StyleDeclaration(o, o.default)), !a || a.declaration.json !== i.json) {
                        var r = util.extend({ duration: 300, delay: 0 }, n, this.getLightProperty(t + TRANSITION_SUFFIX)),
                            l = this._transitions[t] = new StyleTransition(o, i, a, r);
                        l.instant() || (l.loopID = s.set(l.endTime - Date.now())), a && s.cancel(a.loopID) } }, updateLightTransitions: function(t, i, e) {
                    var n;
                    for (n in this._declarations) this._applyLightDeclaration(n, this._declarations[n], t, i, e) }, _validate: function(t, i) {
                    return validateStyle.emitErrors(this, t.call(validateStyle, util.extend({ value: i, style: { glyphs: !0, sprite: !0 }, styleSpec: styleSpec }))) } });
        }, { "../util/evented": 113, "../util/util": 122, "./style_declaration": 57, "./style_spec": 66, "./style_transition": 67, "./validate_style": 68 }],
        55: [function(require, module, exports) {
            "use strict";
            var parseColorString = require("csscolorparser").parseCSSColor,
                util = require("../util/util"),
                StyleFunction = require("./style_function"),
                cache = {};
            module.exports = function r(t) {
                if (StyleFunction.isFunctionDefinition(t)) return t.stops ? util.extend({}, t, { stops: t.stops.map(function(t) {
                        return [t[0], r(t[1])] }) }) : t;
                if ("string" == typeof t) {
                    if (!cache[t]) {
                        var e = parseColorString(t);
                        if (!e) throw new Error("Invalid color " + t);
                        cache[t] = [e[0] / 255 * e[3], e[1] / 255 * e[3], e[2] / 255 * e[3], e[3]] }
                    return cache[t] }
                if (Array.isArray(t)) return t;
                throw new Error("Invalid color " + t) };
        }, { "../util/util": 122, "./style_function": 58, "csscolorparser": 136 }],
        56: [function(require, module, exports) {
            "use strict";

            function Style(e, t, r) { this.map = t, this.animationLoop = t && t.animationLoop || new AnimationLoop, this.dispatcher = new Dispatcher(getWorkerPool(), this), this.spriteAtlas = new SpriteAtlas(1024, 1024), this.lineAtlas = new LineAtlas(256, 512), this._layers = {}, this._order = [], this._groups = [], this.sourceCaches = {}, this.zoomHistory = {}, util.bindAll(["_redoPlacement"], this), this._resetUpdates(), r = util.extend({ validate: "string" != typeof e || !mapbox.isMapboxURL(e) }, r), this.setEventedParent(t), this.fire("dataloading", { dataType: "style" });
                var s = function(e, t) {
                    if (e) return void this.fire("error", { error: e });
                    if (!r.validate || !validateStyle.emitErrors(this, validateStyle(t))) { this._loaded = !0, this.stylesheet = t, this.updateClasses();
                        for (var s in t.sources) this.addSource(s, t.sources[s], r);
                        t.sprite && (this.sprite = new ImageSprite(t.sprite), this.sprite.setEventedParent(this)), this.glyphSource = new GlyphSource(t.glyphs), this._resolve(), this.fire("data", { dataType: "style" }), this.fire("style.load") } }.bind(this); "string" == typeof e ? ajax.getJSON(mapbox.normalizeStyleURL(e), s) : browser.frame(s.bind(this, null, e)), this.on("source.load", function(e) {
                    var t = e.source;
                    if (t && t.vectorLayerIds)
                        for (var r in this._layers) {
                            var s = this._layers[r];
                            s.source === t.id && this._validateLayer(s) } }) }
            var Evented = require("../util/evented"),
                StyleLayer = require("./style_layer"),
                ImageSprite = require("./image_sprite"),
                Light = require("./light"),
                GlyphSource = require("../symbol/glyph_source"),
                SpriteAtlas = require("../symbol/sprite_atlas"),
                LineAtlas = require("../render/line_atlas"),
                util = require("../util/util"),
                ajax = require("../util/ajax"),
                mapbox = require("../util/mapbox"),
                browser = require("../util/browser"),
                Dispatcher = require("../util/dispatcher"),
                AnimationLoop = require("./animation_loop"),
                validateStyle = require("./validate_style"),
                Source = require("../source/source"),
                QueryFeatures = require("../source/query_features"),
                SourceCache = require("../source/source_cache"),
                styleSpec = require("./style_spec"),
                StyleFunction = require("./style_function"),
                getWorkerPool = require("../global_worker_pool");
            module.exports = Style, Style.prototype = util.inherit(Evented, { _loaded: !1, _validateLayer: function(e) {
                    var t = this.sourceCaches[e.source];
                    if (e.sourceLayer && t) {
                        var r = t.getSource();
                        r.vectorLayerIds && r.vectorLayerIds.indexOf(e.sourceLayer) === -1 && this.fire("error", { error: new Error('Source layer "' + e.sourceLayer + '" does not exist on source "' + r.id + '" as specified by style layer "' + e.id + '"') }) } }, loaded: function() {
                    if (!this._loaded) return !1;
                    if (Object.keys(this._updates.sources).length) return !1;
                    for (var e in this.sourceCaches)
                        if (!this.sourceCaches[e].loaded()) return !1;
                    return !(this.sprite && !this.sprite.loaded()) }, _resolve: function() {
                    var e, t;
                    this._layers = {}, this._order = this.stylesheet.layers.map(function(e) {
                        return e.id });
                    for (var r = 0; r < this.stylesheet.layers.length; r++) t = this.stylesheet.layers[r], t.ref || (e = StyleLayer.create(t), this._layers[e.id] = e, e.setEventedParent(this, { layer: { id: e.id } }));
                    for (var s = 0; s < this.stylesheet.layers.length; s++)
                        if (t = this.stylesheet.layers[s], t.ref) {
                            var i = this.getLayer(t.ref);
                            e = StyleLayer.create(t, i), this._layers[e.id] = e, e.setEventedParent(this, { layer: { id: e.id } }) }
                    this._groupLayers(), this._updateWorkerLayers(), this.light = new Light(this.stylesheet.light) }, _groupLayers: function() {
                    var e;
                    this._groups = [];
                    for (var t = 0; t < this._order.length; ++t) {
                        var r = this._layers[this._order[t]];
                        e && r.source === e.source || (e = [], e.source = r.source, this._groups.push(e)), e.push(r) } }, _updateWorkerLayers: function(e) { this.dispatcher.broadcast(e ? "update layers" : "set layers", this._serializeLayers(e)) }, _serializeLayers: function(e) { e = e || this._order;
                    for (var t = [], r = { includeRefProperties: !0 }, s = 0; s < e.length; s++) t.push(this._layers[e[s]].serialize(r));
                    return t }, _applyClasses: function(e, t) {
                    if (this._loaded) { e = e || [], t = t || { transition: !0 };
                        var r = this.stylesheet.transition || {},
                            s = this._updates.allPaintProps ? this._layers : this._updates.paintProps;
                        for (var i in s) {
                            var a = this._layers[i],
                                o = this._updates.paintProps[i];
                            if (this._updates.allPaintProps || o.all) a.updatePaintTransitions(e, t, r, this.animationLoop);
                            else
                                for (var h in o) this._layers[i].updatePaintTransition(h, e, t, r, this.animationLoop) }
                        this.light.updateLightTransitions(t, r, this.animationLoop) } }, _recalculate: function(e) {
                    if (this._loaded) {
                        for (var t in this.sourceCaches) this.sourceCaches[t].used = !1;
                        this._updateZoomHistory(e), this.rasterFadeDuration = 300;
                        for (var r in this._layers) {
                            var s = this._layers[r];
                            s.recalculate(e, this.zoomHistory), !s.isHidden(e) && s.source && (this.sourceCaches[s.source].used = !0) }
                        this.light.recalculate(e, this.zoomHistory);
                        var i = 300;
                        Math.floor(this.z) !== Math.floor(e) && this.animationLoop.set(i), this.z = e } }, _updateZoomHistory: function(e) {
                    var t = this.zoomHistory;
                    void 0 === t.lastIntegerZoom && (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = 0, t.lastZoom = e), Math.floor(t.lastZoom) < Math.floor(e) ? (t.lastIntegerZoom = Math.floor(e), t.lastIntegerZoomTime = Date.now()) : Math.floor(t.lastZoom) > Math.floor(e) && (t.lastIntegerZoom = Math.floor(e + 1), t.lastIntegerZoomTime = Date.now()), t.lastZoom = e }, _checkLoaded: function() {
                    if (!this._loaded) throw new Error("Style is not done loading") }, update: function(e, t) {
                    if (!this._updates.changed) return this;
                    if (this._updates.allLayers) this._groupLayers(), this._updateWorkerLayers();
                    else {
                        var r = Object.keys(this._updates.layers);
                        r.length && this._updateWorkerLayers(r) }
                    var s, i = Object.keys(this._updates.sources);
                    for (s = 0; s < i.length; s++) this._reloadSource(i[s]);
                    for (s = 0; s < this._updates.events.length; s++) {
                        var a = this._updates.events[s];
                        this.fire(a[0], a[1]) }
                    return this._applyClasses(e, t), this._updates.changed && this.fire("data", { dataType: "style" }), this._resetUpdates(), this }, _resetUpdates: function() { this._updates = { events: [], layers: {}, sources: {}, paintProps: {} } }, addSource: function(e, t, r) {
                    if (this._checkLoaded(), void 0 !== this.sourceCaches[e]) throw new Error("There is already a source with this ID");
                    if (!t.type) throw new Error("The type property must be defined, but the only the following properties were given: " + Object.keys(t) + ".");
                    var s = ["vector", "raster", "geojson", "video", "image"],
                        i = s.indexOf(t.type) >= 0;
                    return i && this._validate(validateStyle.source, "sources." + e, t, null, r) ? this : (t = new SourceCache(e, t, this.dispatcher), this.sourceCaches[e] = t, t.style = this, t.setEventedParent(this, { source: t.getSource() }), t.onAdd && t.onAdd(this.map), this._updates.changed = !0, this) }, removeSource: function(e) {
                    if (this._checkLoaded(), void 0 === this.sourceCaches[e]) throw new Error("There is no source with this ID");
                    var t = this.sourceCaches[e];
                    return delete this.sourceCaches[e], delete this._updates.sources[e], t.setEventedParent(null), t.clearTiles(), t.onRemove && t.onRemove(this.map), this._updates.changed = !0, this }, getSource: function(e) {
                    return this.sourceCaches[e] && this.sourceCaches[e].getSource() }, addLayer: function(e, t, r) {
                    if (this._checkLoaded(), !(e instanceof StyleLayer)) {
                        if (this._validate(validateStyle.layer, "layers." + e.id, e, { arrayIndex: -1 }, r)) return this;
                        var s = e.ref && this.getLayer(e.ref);
                        e = StyleLayer.create(e, s) }
                    return this._validateLayer(e), e.setEventedParent(this, { layer: { id: e.id } }), this._layers[e.id] = e, this._order.splice(t ? this._order.indexOf(t) : 1 / 0, 0, e.id), this._updates.allLayers = !0, e.source && (this._updates.sources[e.source] = !0), this.updateClasses(e.id) }, removeLayer: function(e) { this._checkLoaded();
                    var t = this._layers[e];
                    if (void 0 === t) throw new Error("There is no layer with this ID");
                    for (var r in this._layers) this._layers[r].ref === e && this.removeLayer(r);
                    return t.setEventedParent(null), delete this._layers[e], delete this._updates.layers[e], delete this._updates.paintProps[e], this._order.splice(this._order.indexOf(e), 1), this._updates.allLayers = !0, this._updates.changed = !0, this }, getLayer: function(e) {
                    return this._layers[e] }, getReferentLayer: function(e) {
                    var t = this.getLayer(e);
                    return t.ref && (t = this.getLayer(t.ref)), t }, setLayerZoomRange: function(e, t, r) { this._checkLoaded();
                    var s = this.getReferentLayer(e);
                    return s.minzoom === t && s.maxzoom === r ? this : (null != t && (s.minzoom = t), null != r && (s.maxzoom = r), this._updateLayer(s)) }, setFilter: function(e, t) { this._checkLoaded();
                    var r = this.getReferentLayer(e);
                    return null !== t && this._validate(validateStyle.filter, "layers." + r.id + ".filter", t) ? this : util.deepEqual(r.filter, t) ? this : (r.filter = util.clone(t), this._updateLayer(r)) }, getFilter: function(e) {
                    return util.clone(this.getReferentLayer(e).filter) }, setLayoutProperty: function(e, t, r) { this._checkLoaded();
                    var s = this.getReferentLayer(e);
                    return util.deepEqual(s.getLayoutProperty(t), r) ? this : (s.setLayoutProperty(t, r), this._updateLayer(s)) }, getLayoutProperty: function(e, t) {
                    return this.getReferentLayer(e).getLayoutProperty(t) }, setPaintProperty: function(e, t, r, s) { this._checkLoaded();
                    var i = this.getLayer(e);
                    if (util.deepEqual(i.getPaintProperty(t, s), r)) return this;
                    var a = i.isPaintValueFeatureConstant(t);
                    i.setPaintProperty(t, r, s);
                    var o = !(r && StyleFunction.isFunctionDefinition(r) && "$zoom" !== r.property && void 0 !== r.property);
                    return o && a || (this._updates.layers[e] = !0, i.source && (this._updates.sources[i.source] = !0)), this.updateClasses(e, t) }, getPaintProperty: function(e, t, r) {
                    return this.getLayer(e).getPaintProperty(t, r) }, updateClasses: function(e, t) {
                    if (this._updates.changed = !0, e) {
                        var r = this._updates.paintProps;
                        r[e] || (r[e] = {}), r[e][t || "all"] = !0 } else this._updates.allPaintProps = !0;
                    return this }, serialize: function() {
                    return util.filterObject({ version: this.stylesheet.version, name: this.stylesheet.name, metadata: this.stylesheet.metadata, light: this.stylesheet.light, center: this.stylesheet.center, zoom: this.stylesheet.zoom, bearing: this.stylesheet.bearing, pitch: this.stylesheet.pitch, sprite: this.stylesheet.sprite, glyphs: this.stylesheet.glyphs, transition: this.stylesheet.transition, sources: util.mapObject(this.sourceCaches, function(e) {
                            return e.serialize() }), layers: this._order.map(function(e) {
                            return this._layers[e].serialize() }, this) }, function(e) {
                        return void 0 !== e }) }, _updateLayer: function(e) {
                    return this._updates.layers[e.id] = !0, e.source && (this._updates.sources[e.source] = !0), this._updates.changed = !0, this }, _flattenRenderedFeatures: function(e) {
                    for (var t = [], r = this._order.length - 1; r >= 0; r--)
                        for (var s = this._order[r], i = 0; i < e.length; i++) {
                            var a = e[i][s];
                            if (a)
                                for (var o = 0; o < a.length; o++) t.push(a[o]) }
                    return t }, queryRenderedFeatures: function(e, t, r, s) { t && t.filter && this._validate(validateStyle.filter, "queryRenderedFeatures.filter", t.filter);
                    var i = {};
                    if (t && t.layers)
                        for (var a = 0; a < t.layers.length; a++) {
                            var o = this._layers[t.layers[a]];
                            if (!(o instanceof StyleLayer)) return this.fire("error", { error: "The layer '" + t.layers[a] + "' does not exist in the map's style and cannot be queried for features." });
                            i[o.source] = !0 }
                    var h = [];
                    for (var n in this.sourceCaches)
                        if (!t.layers || i[n]) {
                            var l = this.sourceCaches[n],
                                u = QueryFeatures.rendered(l, this._layers, e, t, r, s);
                            h.push(u) }
                    return this._flattenRenderedFeatures(h) }, querySourceFeatures: function(e, t) { t && t.filter && this._validate(validateStyle.filter, "querySourceFeatures.filter", t.filter);
                    var r = this.sourceCaches[e];
                    return r ? QueryFeatures.source(r, t) : [] }, addSourceType: function(e, t, r) {
                    return Source.getType(e) ? r(new Error('A source type called "' + e + '" already exists.')) : (Source.setType(e, t), t.workerSourceURL ? void this.dispatcher.broadcast("load worker source", { name: e, url: t.workerSourceURL }, r) : r(null, null)) }, getLight: function() {
                    return this.light.getLight() }, setLight: function(e, t) { this._checkLoaded();
                    var r = this.light.getLight(),
                        s = !1;
                    for (var i in e)
                        if (!util.deepEqual(e[i], r[i])) { s = !0;
                            break }
                    if (!s) return this;
                    var a = this.stylesheet.transition || {};
                    return this.light.setLight(e), this.light.updateLightTransitions(t || { transition: !0 }, a, this.animationLoop) }, _validate: function(e, t, r, s, i) {
                    return (!i || i.validate !== !1) && validateStyle.emitErrors(this, e.call(validateStyle, util.extend({ key: t, style: this.serialize(), value: r, styleSpec: styleSpec }, s))) }, _remove: function() {
                    for (var e in this.sourceCaches) this.sourceCaches[e].clearTiles();
                    this.dispatcher.remove() }, _reloadSource: function(e) { this.sourceCaches[e].reload() }, _updateSources: function(e) {
                    for (var t in this.sourceCaches) this.sourceCaches[t].update(e) }, _redoPlacement: function() {
                    for (var e in this.sourceCaches) this.sourceCaches[e].redoPlacement && this.sourceCaches[e].redoPlacement() }, "get icons": function(e, t, r) {
                    var s = this.sprite,
                        i = this.spriteAtlas;
                    s.loaded() ? (i.setSprite(s), i.addIcons(t.icons, r)) : s.on("data", function() { i.setSprite(s), i.addIcons(t.icons, r) }) }, "get glyphs": function(e, t, r) {
                    function s(e, t, s) { e && console.error(e), o[s] = t, a--, 0 === a && r(null, o) }
                    var i = t.stacks,
                        a = Object.keys(i).length,
                        o = {};
                    for (var h in i) this.glyphSource.getSimpleGlyphs(h, i[h], t.uid, s) } });
        }, { "../global_worker_pool": 16, "../render/line_atlas": 30, "../source/query_features": 41, "../source/source": 43, "../source/source_cache": 44, "../symbol/glyph_source": 77, "../symbol/sprite_atlas": 82, "../util/ajax": 104, "../util/browser": 105, "../util/dispatcher": 111, "../util/evented": 113, "../util/mapbox": 119, "../util/util": 122, "./animation_loop": 52, "./image_sprite": 53, "./light": 54, "./style_function": 58, "./style_layer": 59, "./style_spec": 66, "./validate_style": 68 }],
        57: [function(require, module, exports) {
            "use strict";

            function StyleDeclaration(t, o) { this.value = util.clone(o), this.isFunction = MapboxGLFunction.isFunctionDefinition(o), this.json = JSON.stringify(this.value);
                var e = "color" === t.type && this.value ? parseColor(this.value) : o,
                    a = t.default;
                if (a && "color" === t.type && (a = parseColor(a)), this.calculate = MapboxGLFunction[t.function || "piecewise-constant"](e), this.isFeatureConstant = this.calculate.isFeatureConstant, this.isZoomConstant = this.calculate.isZoomConstant, "color" === t.type && (this.calculate = wrapColorCalculate(this.calculate)), "piecewise-constant" === t.function && t.transition && (this.calculate = wrapTransitionedCalculate(this.calculate)), !this.isFeatureConstant && !this.isZoomConstant) { this.stopZoomLevels = [];
                    for (var i = [], s = this.value.stops, n = 0; n < this.value.stops.length; n++) {
                        var l = s[n][0].zoom;
                        this.stopZoomLevels.indexOf(l) < 0 && (this.stopZoomLevels.push(l), i.push([l, i.length])) }
                    this.calculateInterpolationT = MapboxGLFunction.interpolated({ stops: i, base: o.base, colorSpace: o.colorSpace }) } }

            function wrapColorCalculate(t) {
                return function(o, e) {
                    var a = t(o, e);
                    return a && parseColor(a) } }

            function wrapTransitionedCalculate(t) {
                return function(o, e) {
                    var a, i, s, n = o.zoom,
                        l = o.zoomHistory,
                        r = o.duration,
                        c = n % 1,
                        u = Math.min((Date.now() - l.lastIntegerZoomTime) / r, 1),
                        p = 1,
                        h = 1;
                    return n > l.lastIntegerZoom ? (a = c + (1 - c) * u, p *= 2, i = t({ zoom: n - 1 }, e), s = t({ zoom: n }, e)) : (a = 1 - (1 - u) * c, s = t({ zoom: n }, e), i = t({ zoom: n + 1 }, e), p /= 2), void 0 === i || void 0 === s ? void 0 : { from: i, fromScale: p, to: s, toScale: h, t: a } } }
            var MapboxGLFunction = require("./style_function"),
                parseColor = require("./parse_color"),
                util = require("../util/util");
            module.exports = StyleDeclaration;
        }, { "../util/util": 122, "./parse_color": 55, "./style_function": 58 }],
        58: [function(require, module, exports) {
            "use strict";
            var MapboxGLFunction = require("mapbox-gl-function");
            exports.interpolated = function(n, t) {
                var o = MapboxGLFunction.interpolated(n, t),
                    i = function(n, t) {
                        return o(n && n.zoom, t || {}) };
                return i.isFeatureConstant = o.isFeatureConstant, i.isZoomConstant = o.isZoomConstant, i }, exports["piecewise-constant"] = function(n, t) {
                var o = MapboxGLFunction["piecewise-constant"](n, t),
                    i = function(n, t) {
                        return o(n && n.zoom, t || {}) };
                return i.isFeatureConstant = o.isFeatureConstant, i.isZoomConstant = o.isZoomConstant, i }, exports.isFunctionDefinition = MapboxGLFunction.isFunctionDefinition;
        }, { "mapbox-gl-function": 162 }],
        59: [function(require, module, exports) {
            "use strict";

            function StyleLayer(t, i) { this.set(t, i) }

            function getDeclarationValue(t) {
                return t.value }
            var util = require("../util/util"),
                StyleTransition = require("./style_transition"),
                StyleDeclaration = require("./style_declaration"),
                styleSpec = require("./style_spec"),
                validateStyle = require("./validate_style"),
                parseColor = require("./parse_color"),
                Evented = require("../util/evented");
            module.exports = StyleLayer;
            var TRANSITION_SUFFIX = "-transition";
            StyleLayer.prototype = util.inherit(Evented, { set: function(t, i) { this.id = t.id, this.ref = t.ref, this.metadata = t.metadata, this.type = (i || t).type, this.source = (i || t).source, this.sourceLayer = (i || t)["source-layer"], this.minzoom = (i || t).minzoom, this.maxzoom = (i || t).maxzoom, this.filter = (i || t).filter, this.paint = {}, this.layout = {}, this._paintSpecifications = styleSpec["paint_" + this.type], this._layoutSpecifications = styleSpec["layout_" + this.type], this._paintTransitions = {}, this._paintTransitionOptions = {}, this._paintDeclarations = {}, this._layoutDeclarations = {}, this._layoutFunctions = {};
                    var a, e, n = { validate: !1 };
                    for (var s in t) {
                        var o = s.match(/^paint(?:\.(.*))?$/);
                        if (o) {
                            var r = o[1] || "";
                            for (a in t[s]) this.setPaintProperty(a, t[s][a], r, n) } }
                    if (this.ref) this._layoutDeclarations = i._layoutDeclarations;
                    else
                        for (e in t.layout) this.setLayoutProperty(e, t.layout[e], n);
                    for (a in this._paintSpecifications) this.paint[a] = this.getPaintValue(a);
                    for (e in this._layoutSpecifications) this._updateLayoutValue(e) }, setLayoutProperty: function(t, i, a) {
                    if (null == i) delete this._layoutDeclarations[t];
                    else {
                        var e = "layers." + this.id + ".layout." + t;
                        if (this._validate(validateStyle.layoutProperty, e, t, i, a)) return;
                        this._layoutDeclarations[t] = new StyleDeclaration(this._layoutSpecifications[t], i) }
                    this._updateLayoutValue(t) }, getLayoutProperty: function(t) {
                    return this._layoutDeclarations[t] && this._layoutDeclarations[t].value }, getLayoutValue: function(t, i, a) {
                    var e = this._layoutSpecifications[t],
                        n = this._layoutDeclarations[t];
                    return n ? n.calculate(i, a) : e.default }, setPaintProperty: function(t, i, a, e) {
                    var n = "layers." + this.id + (a ? '["paint.' + a + '"].' : ".paint.") + t;
                    if (util.endsWith(t, TRANSITION_SUFFIX))
                        if (this._paintTransitionOptions[a || ""] || (this._paintTransitionOptions[a || ""] = {}), null === i || void 0 === i) delete this._paintTransitionOptions[a || ""][t];
                        else {
                            if (this._validate(validateStyle.paintProperty, n, t, i, e)) return;
                            this._paintTransitionOptions[a || ""][t] = i }
                    else if (this._paintDeclarations[a || ""] || (this._paintDeclarations[a || ""] = {}), null === i || void 0 === i) delete this._paintDeclarations[a || ""][t];
                    else {
                        if (this._validate(validateStyle.paintProperty, n, t, i, e)) return;
                        this._paintDeclarations[a || ""][t] = new StyleDeclaration(this._paintSpecifications[t], i) } }, getPaintProperty: function(t, i) {
                    return i = i || "", util.endsWith(t, TRANSITION_SUFFIX) ? this._paintTransitionOptions[i] && this._paintTransitionOptions[i][t] : this._paintDeclarations[i] && this._paintDeclarations[i][t] && this._paintDeclarations[i][t].value }, getPaintValue: function(t, i, a) {
                    var e = this._paintSpecifications[t],
                        n = this._paintTransitions[t];
                    return n ? n.calculate(i, a) : "color" === e.type && e.default ? parseColor(e.default) : e.default }, getPaintValueStopZoomLevels: function(t) {
                    var i = this._paintTransitions[t];
                    return i ? i.declaration.stopZoomLevels : [] }, getPaintInterpolationT: function(t, i) {
                    var a = this._paintTransitions[t];
                    return a.declaration.calculateInterpolationT({ zoom: i }) }, isPaintValueFeatureConstant: function(t) {
                    var i = this._paintTransitions[t];
                    return !i || i.declaration.isFeatureConstant }, isLayoutValueFeatureConstant: function(t) {
                    var i = this._layoutDeclarations[t];
                    return !i || i.isFeatureConstant }, isPaintValueZoomConstant: function(t) {
                    var i = this._paintTransitions[t];
                    return !i || i.declaration.isZoomConstant }, isHidden: function(t) {
                    return !!(this.minzoom && t < this.minzoom) || (!!(this.maxzoom && t >= this.maxzoom) || "none" === this.layout.visibility) }, updatePaintTransitions: function(t, i, a, e) {
                    for (var n = util.extend({}, this._paintDeclarations[""]), s = 0; s < t.length; s++) util.extend(n, this._paintDeclarations[t[s]]);
                    var o;
                    for (o in n) this._applyPaintDeclaration(o, n[o], i, a, e);
                    for (o in this._paintTransitions) o in n || this._applyPaintDeclaration(o, null, i, a, e) }, updatePaintTransition: function(t, i, a, e, n) {
                    for (var s = this._paintDeclarations[""][t], o = 0; o < i.length; o++) {
                        var r = this._paintDeclarations[i[o]];
                        r && r[t] && (s = r[t]) }
                    this._applyPaintDeclaration(t, s, a, e, n) }, recalculate: function(t, i) {
                    for (var a in this._paintTransitions) this.paint[a] = this.getPaintValue(a, { zoom: t, zoomHistory: i });
                    for (var e in this._layoutFunctions) this.layout[e] = this.getLayoutValue(e, { zoom: t, zoomHistory: i }) }, serialize: function(t) {
                    var i = { id: this.id, ref: this.ref, metadata: this.metadata, minzoom: this.minzoom, maxzoom: this.maxzoom };
                    for (var a in this._paintDeclarations) {
                        var e = "" === a ? "paint" : "paint." + a;
                        i[e] = util.mapObject(this._paintDeclarations[a], getDeclarationValue) }
                    return (!this.ref || t && t.includeRefProperties) && util.extend(i, { type: this.type, source: this.source, "source-layer": this.sourceLayer, filter: this.filter, layout: util.mapObject(this._layoutDeclarations, getDeclarationValue) }), util.filterObject(i, function(t, i) {
                        return void 0 !== t && !("layout" === i && !Object.keys(t).length) }) }, _applyPaintDeclaration: function(t, i, a, e, n) {
                    var s = a.transition ? this._paintTransitions[t] : void 0,
                        o = this._paintSpecifications[t];
                    if (null !== i && void 0 !== i || (i = new StyleDeclaration(o, o.default)), !s || s.declaration.json !== i.json) {
                        var r = util.extend({ duration: 300, delay: 0 }, e, this.getPaintProperty(t + TRANSITION_SUFFIX)),
                            l = this._paintTransitions[t] = new StyleTransition(o, i, s, r);
                        l.instant() || (l.loopID = n.set(l.endTime - Date.now())), s && n.cancel(s.loopID) } }, _updateLayoutValue: function(t) {
                    var i = this._layoutDeclarations[t];
                    i && i.isFunction ? this._layoutFunctions[t] = !0 : (delete this._layoutFunctions[t], this.layout[t] = this.getLayoutValue(t)) }, _validate: function(t, i, a, e, n) {
                    return (!n || n.validate !== !1) && validateStyle.emitErrors(this, t.call(validateStyle, { key: i, layerType: this.type, objectKey: a, value: e, styleSpec: styleSpec, style: { glyphs: !0, sprite: !0 } })) } });
            var Classes = { background: require("./style_layer/background_style_layer"), circle: require("./style_layer/circle_style_layer"), fill: require("./style_layer/fill_style_layer"), line: require("./style_layer/line_style_layer"), raster: require("./style_layer/raster_style_layer"), symbol: require("./style_layer/symbol_style_layer") };
            StyleLayer.create = function(t, i) {
                return new Classes[(i || t).type](t, i) };
        }, { "../util/evented": 113, "../util/util": 122, "./parse_color": 55, "./style_declaration": 57, "./style_layer/background_style_layer": 60, "./style_layer/circle_style_layer": 61, "./style_layer/fill_style_layer": 62, "./style_layer/line_style_layer": 63, "./style_layer/raster_style_layer": 64, "./style_layer/symbol_style_layer": 65, "./style_spec": 66, "./style_transition": 67, "./validate_style": 68 }],
        60: [function(require, module, exports) {
            "use strict";

            function BackgroundStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            module.exports = BackgroundStyleLayer, BackgroundStyleLayer.prototype = util.inherit(StyleLayer, {});
        }, { "../../util/util": 122, "../style_layer": 59 }],
        61: [function(require, module, exports) {
            "use strict";

            function CircleStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            module.exports = CircleStyleLayer, CircleStyleLayer.prototype = util.inherit(StyleLayer, {});
        }, { "../../util/util": 122, "../style_layer": 59 }],
        62: [function(require, module, exports) {
            "use strict";

            function FillStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            FillStyleLayer.prototype = util.inherit(StyleLayer, { getPaintValue: function(t, l, e) {
                    return "fill-outline-color" === t && void 0 === this.getPaintProperty("fill-outline-color") ? StyleLayer.prototype.getPaintValue.call(this, "fill-color", l, e) : StyleLayer.prototype.getPaintValue.call(this, t, l, e) }, getPaintValueStopZoomLevels: function(t) {
                    return "fill-outline-color" === t && void 0 === this.getPaintProperty("fill-outline-color") ? StyleLayer.prototype.getPaintValueStopZoomLevels.call(this, "fill-color") : StyleLayer.prototype.getPaintValueStopZoomLevels.call(this, t) }, getPaintInterpolationT: function(t, l) {
                    return "fill-outline-color" === t && void 0 === this.getPaintProperty("fill-outline-color") ? StyleLayer.prototype.getPaintInterpolationT.call(this, "fill-color", l) : StyleLayer.prototype.getPaintInterpolationT.call(this, t, l) }, isPaintValueFeatureConstant: function(t) {
                    return "fill-outline-color" === t && void 0 === this.getPaintProperty("fill-outline-color") ? StyleLayer.prototype.isPaintValueFeatureConstant.call(this, "fill-color") : StyleLayer.prototype.isPaintValueFeatureConstant.call(this, t) }, isPaintValueZoomConstant: function(t) {
                    return "fill-outline-color" === t && void 0 === this.getPaintProperty("fill-outline-color") ? StyleLayer.prototype.isPaintValueZoomConstant.call(this, "fill-color") : StyleLayer.prototype.isPaintValueZoomConstant.call(this, t) } }), module.exports = FillStyleLayer;
        }, { "../../util/util": 122, "../style_layer": 59 }],
        63: [function(require, module, exports) {
            "use strict";

            function LineStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            module.exports = LineStyleLayer, LineStyleLayer.prototype = util.inherit(StyleLayer, { getPaintValue: function(e, t, i) {
                    var r = StyleLayer.prototype.getPaintValue.apply(this, arguments);
                    if (r && "line-dasharray" === e) {
                        var l = Math.floor(t.zoom);
                        this._flooredZoom !== l && (this._flooredZoom = l, this._flooredLineWidth = this.getPaintValue("line-width", t, i)), r.fromScale *= this._flooredLineWidth, r.toScale *= this._flooredLineWidth }
                    return r } });
        }, { "../../util/util": 122, "../style_layer": 59 }],
        64: [function(require, module, exports) {
            "use strict";

            function RasterStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            module.exports = RasterStyleLayer, RasterStyleLayer.prototype = util.inherit(StyleLayer, {});
        }, { "../../util/util": 122, "../style_layer": 59 }],
        65: [function(require, module, exports) {
            "use strict";

            function SymbolStyleLayer() { StyleLayer.apply(this, arguments) }
            var util = require("../../util/util"),
                StyleLayer = require("../style_layer");
            module.exports = SymbolStyleLayer, SymbolStyleLayer.prototype = util.inherit(StyleLayer, { getLayoutValue: function(t, e, a) {
                    var l = StyleLayer.prototype.getLayoutValue.apply(this, arguments);
                    if ("auto" !== l) return l;
                    switch (t) {
                        case "text-rotation-alignment":
                        case "icon-rotation-alignment":
                            return "line" === this.getLayoutValue("symbol-placement", e, a) ? "map" : "viewport";
                        case "text-pitch-alignment":
                            return this.getLayoutValue("text-rotation-alignment", e, a);
                        default:
                            return l } } });
        }, { "../../util/util": 122, "../style_layer": 59 }],
        66: [function(require, module, exports) {
            "use strict";
            module.exports = require("mapbox-gl-style-spec/reference/latest.min");
        }, { "mapbox-gl-style-spec/reference/latest.min": 186 }],
        67: [function(require, module, exports) {
            "use strict";

            function StyleTransition(t, i, e, n) { this.declaration = i, this.startTime = this.endTime = (new Date).getTime(), "piecewise-constant" === t.function && t.transition ? this.interp = interpZoomTransitioned : this.interp = interpolate[t.type], this.oldTransition = e, this.duration = n.duration || 0, this.delay = n.delay || 0, this.instant() || (this.endTime = this.startTime + this.duration + this.delay, this.ease = util.easeCubicInOut), e && e.endTime <= this.startTime && delete e.oldTransition }

            function interpZoomTransitioned(t, i, e) {
                return void 0 === (t && t.to) || void 0 === (i && i.to) ? void 0 : { from: t.to, fromScale: t.toScale, to: i.to, toScale: i.toScale, t: e } }
            var util = require("../util/util"),
                interpolate = require("../util/interpolate");
            module.exports = StyleTransition, StyleTransition.prototype.instant = function() {
                return !this.oldTransition || !this.interp || 0 === this.duration && 0 === this.delay }, StyleTransition.prototype.calculate = function(t, i) {
                var e = this.declaration.calculate(util.extend({}, t, { duration: this.duration }), i);
                if (this.instant()) return e;
                var n = t.time || Date.now();
                if (n < this.endTime) {
                    var a = this.oldTransition.calculate(util.extend({}, t, { time: this.startTime }), i),
                        o = this.ease((n - this.startTime - this.delay) / this.duration);
                    e = this.interp(a, e, o) }
                return e };
        }, { "../util/interpolate": 116, "../util/util": 122 }],
        68: [function(require, module, exports) {
            "use strict";
            module.exports = require("mapbox-gl-style-spec/lib/validate_style.min"), module.exports.emitErrors = function(r, e) {
                if (e && e.length) {
                    for (var t = 0; t < e.length; t++) r.fire("error", { error: new Error(e[t].message) });
                    return !0 }
                return !1 };
        }, { "mapbox-gl-style-spec/lib/validate_style.min": 185 }],
        69: [function(require, module, exports) {
            "use strict";

            function Anchor(t, e, o, n) { this.x = t, this.y = e, this.angle = o, void 0 !== n && (this.segment = n) }
            var Point = require("point-geometry");
            module.exports = Anchor, Anchor.prototype = Object.create(Point.prototype), Anchor.prototype.clone = function() {
                return new Anchor(this.x, this.y, this.angle, this.segment) };
        }, { "point-geometry": 192 }],
        70: [function(require, module, exports) {
            "use strict";

            function checkMaxAngle(e, t, a, r, n) {
                if (void 0 === t.segment) return !0;
                for (var i = t, s = t.segment + 1, f = 0; f > -a / 2;) {
                    if (s--, s < 0) return !1;
                    f -= e[s].dist(i), i = e[s] }
                f += e[s].dist(e[s + 1]), s++;
                for (var l = [], o = 0; f < a / 2;) {
                    var u = e[s - 1],
                        c = e[s],
                        g = e[s + 1];
                    if (!g) return !1;
                    var h = u.angleTo(c) - c.angleTo(g);
                    for (h = Math.abs((h + 3 * Math.PI) % (2 * Math.PI) - Math.PI), l.push({ distance: f, angleDelta: h }), o += h; f - l[0].distance > r;) o -= l.shift().angleDelta;
                    if (o > n) return !1;
                    s++, f += c.dist(g) }
                return !0 }
            module.exports = checkMaxAngle;
        }, {}],
        71: [function(require, module, exports) {
            "use strict";

            function clipLine(n, x, y, o, e) {
                for (var r = [], t = 0; t < n.length; t++)
                    for (var i, u = n[t], d = 0; d < u.length - 1; d++) {
                        var P = u[d],
                            w = u[d + 1];
                        P.x < x && w.x < x || (P.x < x ? P = new Point(x, P.y + (w.y - P.y) * ((x - P.x) / (w.x - P.x)))._round() : w.x < x && (w = new Point(x, P.y + (w.y - P.y) * ((x - P.x) / (w.x - P.x)))._round()), P.y < y && w.y < y || (P.y < y ? P = new Point(P.x + (w.x - P.x) * ((y - P.y) / (w.y - P.y)), y)._round() : w.y < y && (w = new Point(P.x + (w.x - P.x) * ((y - P.y) / (w.y - P.y)), y)._round()), P.x >= o && w.x >= o || (P.x >= o ? P = new Point(o, P.y + (w.y - P.y) * ((o - P.x) / (w.x - P.x)))._round() : w.x >= o && (w = new Point(o, P.y + (w.y - P.y) * ((o - P.x) / (w.x - P.x)))._round()), P.y >= e && w.y >= e || (P.y >= e ? P = new Point(P.x + (w.x - P.x) * ((e - P.y) / (w.y - P.y)), e)._round() : w.y >= e && (w = new Point(P.x + (w.x - P.x) * ((e - P.y) / (w.y - P.y)), e)._round()), i && P.equals(i[i.length - 1]) || (i = [P], r.push(i)), i.push(w))))) }
                return r }
            var Point = require("point-geometry");
            module.exports = clipLine;
        }, { "point-geometry": 192 }],
        72: [function(require, module, exports) {
            "use strict";
            var StructArrayType = require("../util/struct_array"),
                util = require("../util/util"),
                Point = require("point-geometry"),
                CollisionBoxArray = module.exports = new StructArrayType({ members: [{ type: "Int16", name: "anchorPointX" }, { type: "Int16", name: "anchorPointY" }, { type: "Int16", name: "x1" }, { type: "Int16", name: "y1" }, { type: "Int16", name: "x2" }, { type: "Int16", name: "y2" }, { type: "Float32", name: "maxScale" }, { type: "Uint32", name: "featureIndex" }, { type: "Uint16", name: "sourceLayerIndex" }, { type: "Uint16", name: "bucketIndex" }, { type: "Int16", name: "bbox0" }, { type: "Int16", name: "bbox1" }, { type: "Int16", name: "bbox2" }, { type: "Int16", name: "bbox3" }, { type: "Float32", name: "placementScale" }] });
            util.extendAll(CollisionBoxArray.prototype.StructType.prototype, {get anchorPoint() {
                    return new Point(this.anchorPointX, this.anchorPointY) } });
        }, { "../util/struct_array": 120, "../util/util": 122, "point-geometry": 192 }],
        73: [function(require, module, exports) {
            "use strict";

            function CollisionFeature(t, e, i, o, s, n, a, l, r, d, u) {
                var h = a.top * l - r,
                    x = a.bottom * l + r,
                    f = a.left * l - r,
                    m = a.right * l + r;
                if (this.boxStartIndex = t.length, d) {
                    var _ = x - h,
                        b = m - f;
                    if (_ > 0)
                        if (_ = Math.max(10 * l, _), u) {
                            var c = e[i.segment + 1].sub(e[i.segment])._unit()._mult(b),
                                g = [i.sub(c), i.add(c)];
                            this._addLineCollisionBoxes(t, g, i, 0, b, _, o, s, n) } else this._addLineCollisionBoxes(t, e, i, i.segment, b, _, o, s, n) } else t.emplaceBack(i.x, i.y, f, h, m, x, 1 / 0, o, s, n, 0, 0, 0, 0, 0);
                this.boxEndIndex = t.length }
            module.exports = CollisionFeature, CollisionFeature.prototype._addLineCollisionBoxes = function(t, e, i, o, s, n, a, l, r) {
                var d = n / 2,
                    u = Math.floor(s / d),
                    h = -n / 2,
                    x = this.boxes,
                    f = i,
                    m = o + 1,
                    _ = h;
                do {
                    if (m--, m < 0) return x;
                    _ -= e[m].dist(f), f = e[m] } while (_ > -s / 2);
                for (var b = e[m].dist(e[m + 1]), c = 0; c < u; c++) {
                    for (var g = -s / 2 + c * d; _ + b < g;) {
                        if (_ += b, m++, m + 1 >= e.length) return x;
                        b = e[m].dist(e[m + 1]) }
                    var v = g - _,
                        p = e[m],
                        C = e[m + 1],
                        B = C.sub(p)._unit()._mult(v)._add(p)._round(),
                        M = Math.max(Math.abs(g - h) - d / 2, 0),
                        y = s / 2 / M;
                    t.emplaceBack(B.x, B.y, -n / 2, -n / 2, n / 2, n / 2, y, a, l, r, 0, 0, 0, 0, 0) }
                return x };
        }, {}],
        74: [function(require, module, exports) {
            "use strict";

            function CollisionTile(t, i, e) {
                if ("object" == typeof t) {
                    var r = t;
                    e = i, t = r.angle, i = r.pitch, this.grid = new Grid(r.grid), this.ignoredGrid = new Grid(r.ignoredGrid) } else this.grid = new Grid(EXTENT, 12, 6), this.ignoredGrid = new Grid(EXTENT, 12, 0);
                this.angle = t, this.pitch = i;
                var a = Math.sin(t),
                    o = Math.cos(t);
                if (this.rotationMatrix = [o, -a, a, o], this.reverseRotationMatrix = [o, a, -a, o], this.yStretch = 1 / Math.cos(i / 180 * Math.PI), this.yStretch = Math.pow(this.yStretch, 1.3), this.collisionBoxArray = e, 0 === e.length) { e.emplaceBack();
                    var n = 32767;
                    e.emplaceBack(0, 0, 0, -n, 0, n, n, 0, 0, 0, 0, 0, 0, 0, 0, 0), e.emplaceBack(EXTENT, 0, 0, -n, 0, n, n, 0, 0, 0, 0, 0, 0, 0, 0, 0), e.emplaceBack(0, 0, -n, 0, n, 0, n, 0, 0, 0, 0, 0, 0, 0, 0, 0), e.emplaceBack(0, EXTENT, -n, 0, n, 0, n, 0, 0, 0, 0, 0, 0, 0, 0, 0) }
                this.tempCollisionBox = e.get(0), this.edges = [e.get(1), e.get(2), e.get(3), e.get(4)] }
            var Point = require("point-geometry"),
                EXTENT = require("../data/bucket").EXTENT,
                Grid = require("grid-index");
            module.exports = CollisionTile, CollisionTile.prototype.serialize = function() {
                var t = { angle: this.angle, pitch: this.pitch, grid: this.grid.toArrayBuffer(), ignoredGrid: this.ignoredGrid.toArrayBuffer() };
                return { data: t, transferables: [t.grid, t.ignoredGrid] } }, CollisionTile.prototype.minScale = .25, CollisionTile.prototype.maxScale = 2, CollisionTile.prototype.placeCollisionFeature = function(t, i, e) {
                for (var r = this.collisionBoxArray, a = this.minScale, o = this.rotationMatrix, n = this.yStretch, l = t.boxStartIndex; l < t.boxEndIndex; l++) {
                    var s = r.get(l),
                        h = s.anchorPoint._matMult(o),
                        x = h.x,
                        c = h.y,
                        y = x + s.x1,
                        d = c + s.y1 * n,
                        g = x + s.x2,
                        m = c + s.y2 * n;
                    if (s.bbox0 = y, s.bbox1 = d, s.bbox2 = g, s.bbox3 = m, !i)
                        for (var u = this.grid.query(y, d, g, m), p = 0; p < u.length; p++) {
                            var S = r.get(u[p]),
                                f = S.anchorPoint._matMult(o);
                            if (a = this.getPlacementScale(a, h, s, f, S), a >= this.maxScale) return a }
                    if (e) {
                        var v;
                        if (this.angle) {
                            var M = this.reverseRotationMatrix,
                                b = new Point(s.x1, s.y1).matMult(M),
                                T = new Point(s.x2, s.y1).matMult(M),
                                P = new Point(s.x1, s.y2).matMult(M),
                                B = new Point(s.x2, s.y2).matMult(M);
                            v = this.tempCollisionBox, v.anchorPointX = s.anchorPoint.x, v.anchorPointY = s.anchorPoint.y, v.x1 = Math.min(b.x, T.x, P.x, B.x), v.y1 = Math.min(b.y, T.x, P.x, B.x), v.x2 = Math.max(b.x, T.x, P.x, B.x), v.y2 = Math.max(b.y, T.x, P.x, B.x), v.maxScale = s.maxScale } else v = s;
                        for (var C = 0; C < this.edges.length; C++) {
                            var E = this.edges[C];
                            if (a = this.getPlacementScale(a, s.anchorPoint, v, E.anchorPoint, E), a >= this.maxScale) return a } } }
                return a }, CollisionTile.prototype.queryRenderedSymbols = function(t, i, e, r, a) {
                var o = {},
                    n = [],
                    l = this.collisionBoxArray,
                    s = this.rotationMatrix,
                    h = new Point(t, i)._matMult(s),
                    x = this.tempCollisionBox;
                x.anchorX = h.x, x.anchorY = h.y, x.x1 = 0, x.y1 = 0, x.x2 = e - t, x.y2 = r - i, x.maxScale = a, a = x.maxScale;
                for (var c = [h.x + x.x1 / a, h.y + x.y1 / a * this.yStretch, h.x + x.x2 / a, h.y + x.y2 / a * this.yStretch], y = this.grid.query(c[0], c[1], c[2], c[3]), d = this.ignoredGrid.query(c[0], c[1], c[2], c[3]), g = 0; g < d.length; g++) y.push(d[g]);
                for (var m = 0; m < y.length; m++) {
                    var u = l.get(y[m]),
                        p = u.sourceLayerIndex,
                        S = u.featureIndex;
                    if (void 0 === o[p] && (o[p] = {}), !o[p][S]) {
                        var f = u.anchorPoint.matMult(s),
                            v = this.getPlacementScale(this.minScale, h, x, f, u);
                        v >= a && (o[p][S] = !0, n.push(y[m])) } }
                return n }, CollisionTile.prototype.getPlacementScale = function(t, i, e, r, a) {
                var o = i.x - r.x,
                    n = i.y - r.y,
                    l = (a.x1 - e.x2) / o,
                    s = (a.x2 - e.x1) / o,
                    h = (a.y1 - e.y2) * this.yStretch / n,
                    x = (a.y2 - e.y1) * this.yStretch / n;
                (isNaN(l) || isNaN(s)) && (l = s = 1), (isNaN(h) || isNaN(x)) && (h = x = 1);
                var c = Math.min(Math.max(l, s), Math.max(h, x)),
                    y = a.maxScale,
                    d = e.maxScale;
                return c > y && (c = y), c > d && (c = d), c > t && c >= a.placementScale && (t = c), t }, CollisionTile.prototype.insertCollisionFeature = function(t, i, e) {
                for (var r = e ? this.ignoredGrid : this.grid, a = this.collisionBoxArray, o = t.boxStartIndex; o < t.boxEndIndex; o++) {
                    var n = a.get(o);
                    n.placementScale = i, i < this.maxScale && r.insert(o, n.bbox0, n.bbox1, n.bbox2, n.bbox3) } };
        }, { "../data/bucket": 2, "grid-index": 160, "point-geometry": 192 }],
        75: [function(require, module, exports) {
            "use strict";

            function getAnchors(e, r, t, n, a, l, o, i, h) {
                var c = n ? .6 * l * o : 0,
                    s = Math.max(n ? n.right - n.left : 0, a ? a.right - a.left : 0),
                    u = 0 === e[0].x || e[0].x === h || 0 === e[0].y || e[0].y === h;
                r - s * o < r / 4 && (r = s * o + r / 4);
                var g = 2 * l,
                    p = u ? r / 2 * i % r : (s / 2 + g) * o * i % r;
                return resample(e, p, r, c, t, s * o, u, !1, h) }

            function resample(e, r, t, n, a, l, o, i, h) {
                for (var c = l / 2, s = 0, u = 0; u < e.length - 1; u++) s += e[u].dist(e[u + 1]);
                for (var g = 0, p = r - t, x = [], f = 0; f < e.length - 1; f++) {
                    for (var v = e[f], m = e[f + 1], A = v.dist(m), y = m.angleTo(v); p + t < g + A;) { p += t;
                        var d = (p - g) / A,
                            k = interpolate(v.x, m.x, d),
                            q = interpolate(v.y, m.y, d);
                        if (k >= 0 && k < h && q >= 0 && q < h && p - c >= 0 && p + c <= s) {
                            var M = new Anchor(k, q, y, f)._round();
                            n && !checkMaxAngle(e, M, l, n, a) || x.push(M) } }
                    g += A }
                return i || x.length || o || (x = resample(e, g / 2, t, n, a, l, o, !0, h)), x }
            var interpolate = require("../util/interpolate"),
                Anchor = require("../symbol/anchor"),
                checkMaxAngle = require("./check_max_angle");
            module.exports = getAnchors;
        }, { "../symbol/anchor": 69, "../util/interpolate": 116, "./check_max_angle": 70 }],
        76: [function(require, module, exports) {
            "use strict";

            function GlyphAtlas() { this.width = DEFAULT_SIZE, this.height = DEFAULT_SIZE, this.bin = new ShelfPack(this.width, this.height), this.index = {}, this.ids = {}, this.data = new Uint8Array(this.width * this.height) }
            var ShelfPack = require("shelf-pack"),
                util = require("../util/util"),
                SIZE_GROWTH_RATE = 4,
                DEFAULT_SIZE = 128,
                MAX_SIZE = 2048;
            module.exports = GlyphAtlas, GlyphAtlas.prototype.getGlyphs = function() {
                var t, i, e, h = {};
                for (var r in this.ids) t = r.split("#"), i = t[0], e = t[1], h[i] || (h[i] = []), h[i].push(e);
                return h }, GlyphAtlas.prototype.getRects = function() {
                var t, i, e, h = {};
                for (var r in this.ids) t = r.split("#"), i = t[0], e = t[1], h[i] || (h[i] = {}), h[i][e] = this.index[r];
                return h }, GlyphAtlas.prototype.addGlyph = function(t, i, e, h) {
                if (!e) return null;
                var r = i + "#" + e.id;
                if (this.index[r]) return this.ids[r].indexOf(t) < 0 && this.ids[r].push(t), this.index[r];
                if (!e.bitmap) return null;
                var s = e.width + 2 * h,
                    a = e.height + 2 * h,
                    n = 1,
                    E = s + 2 * n,
                    T = a + 2 * n;
                E += 4 - E % 4, T += 4 - T % 4;
                var u = this.bin.packOne(E, T);
                if (u || (this.resize(), u = this.bin.packOne(E, T)), !u) return util.warnOnce("glyph bitmap overflow"), null;
                this.index[r] = u, this.ids[r] = [t];
                for (var l = this.data, d = e.bitmap, A = 0; A < a; A++)
                    for (var _ = this.width * (u.y + A + n) + u.x + n, p = s * A, o = 0; o < s; o++) l[_ + o] = d[p + o];
                return this.dirty = !0, u }, GlyphAtlas.prototype.resize = function() {
                var t = this.width,
                    i = this.height;
                if (!(t >= MAX_SIZE || i >= MAX_SIZE)) { this.texture && (this.gl && this.gl.deleteTexture(this.texture), this.texture = null), this.width *= SIZE_GROWTH_RATE, this.height *= SIZE_GROWTH_RATE, this.bin.resize(this.width, this.height);
                    for (var e = new ArrayBuffer(this.width * this.height), h = 0; h < i; h++) {
                        var r = new Uint8Array(this.data.buffer, i * h, t),
                            s = new Uint8Array(e, i * h * SIZE_GROWTH_RATE, t);
                        s.set(r) }
                    this.data = new Uint8Array(e) } }, GlyphAtlas.prototype.bind = function(t) { this.gl = t, this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), t.texImage2D(t.TEXTURE_2D, 0, t.ALPHA, this.width, this.height, 0, t.ALPHA, t.UNSIGNED_BYTE, null)) }, GlyphAtlas.prototype.updateTexture = function(t) { this.bind(t), this.dirty && (t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width, this.height, t.ALPHA, t.UNSIGNED_BYTE, this.data), this.dirty = !1) };
        }, { "../util/util": 122, "shelf-pack": 194 }],
        77: [function(require, module, exports) {
            "use strict";

            function GlyphSource(t) { this.url = t && normalizeURL(t), this.atlases = {}, this.stacks = {}, this.loading = {} }

            function SimpleGlyph(t, e, l) {
                var s = 1;
                this.advance = t.advance, this.left = t.left - l - s, this.top = t.top + l + s, this.rect = e }

            function glyphUrl(t, e, l, s) {
                return s = s || "abc", l.replace("{s}", s[t.length % s.length]).replace("{fontstack}", t).replace("{range}", e) }
            var normalizeURL = require("../util/mapbox").normalizeGlyphsURL,
                ajax = require("../util/ajax"),
                Glyphs = require("../util/glyphs"),
                GlyphAtlas = require("../symbol/glyph_atlas"),
                Protobuf = require("pbf");
            module.exports = GlyphSource, GlyphSource.prototype.getSimpleGlyphs = function(t, e, l, s) { void 0 === this.stacks[t] && (this.stacks[t] = {}), void 0 === this.atlases[t] && (this.atlases[t] = new GlyphAtlas);
                for (var a, i = {}, r = this.stacks[t], h = this.atlases[t], o = 3, p = {}, n = 0, u = 0; u < e.length; u++) {
                    var y = e[u];
                    if (a = Math.floor(y / 256), r[a]) {
                        var c = r[a].glyphs[y],
                            f = h.addGlyph(l, t, c, o);
                        c && (i[y] = new SimpleGlyph(c, f, o)) } else void 0 === p[a] && (p[a] = [], n++), p[a].push(y) }
                n || s(void 0, i, t);
                var d = function(e, a, r) {
                    if (!e)
                        for (var u = this.stacks[t][a] = r.stacks[0], y = 0; y < p[a].length; y++) {
                            var c = p[a][y],
                                f = u.glyphs[c],
                                d = h.addGlyph(l, t, f, o);
                            f && (i[c] = new SimpleGlyph(f, d, o)) }
                    n--, n || s(void 0, i, t) }.bind(this);
                for (var g in p) this.loadRange(t, g, d) }, GlyphSource.prototype.loadRange = function(t, e, l) {
                if (256 * e > 65535) return l("glyphs > 65535 not supported");
                void 0 === this.loading[t] && (this.loading[t] = {});
                var s = this.loading[t];
                if (s[e]) s[e].push(l);
                else { s[e] = [l];
                    var a = 256 * e + "-" + (256 * e + 255),
                        i = glyphUrl(t, a, this.url);
                    ajax.getArrayBuffer(i, function(t, l) {
                        for (var a = !t && new Glyphs(new Protobuf(l)), i = 0; i < s[e].length; i++) s[e][i](t, e, a);
                        delete s[e] }) } }, GlyphSource.prototype.getGlyphAtlas = function(t) {
                return this.atlases[t] };
        }, { "../symbol/glyph_atlas": 76, "../util/ajax": 104, "../util/glyphs": 115, "../util/mapbox": 119, "pbf": 190 }],
        78: [function(require, module, exports) {
            "use strict";
            module.exports = function(e, t, n) {
                function r(r) { c.push(e[r]), f.push(n[r]), v.push(t[r]), h++ }

                function u(e, t, n) {
                    var r = l[e];
                    return delete l[e], l[t] = r, f[r][0].pop(), f[r][0] = f[r][0].concat(n[0]), r }

                function i(e, t, n) {
                    var r = a[t];
                    return delete a[t], a[e] = r, f[r][0].shift(), f[r][0] = n[0].concat(f[r][0]), r }

                function o(e, t, n) {
                    var r = n ? t[0][t[0].length - 1] : t[0][0];
                    return e + ":" + r.x + ":" + r.y }
                var s, a = {},
                    l = {},
                    c = [],
                    f = [],
                    v = [],
                    h = 0;
                for (s = 0; s < e.length; s++) {
                    var p = n[s],
                        d = t[s];
                    if (d) {
                        var g = o(d, p),
                            x = o(d, p, !0);
                        if (g in l && x in a && l[g] !== a[x]) {
                            var m = i(g, x, p),
                                y = u(g, x, f[m]);
                            delete a[g], delete l[x], l[o(d, f[y], !0)] = y, f[m] = null } else g in l ? u(g, x, p) : x in a ? i(g, x, p) : (r(s), a[g] = h - 1, l[x] = h - 1) } else r(s) }
                return { features: c, textFeatures: v, geometries: f } };
        }, {}],
        79: [function(require, module, exports) {
            "use strict";

            function SymbolQuad(t, e, a, n, i, o, h, l, r, s) { this.anchorPoint = t, this.tl = e, this.tr = a, this.bl = n, this.br = i, this.tex = o, this.anchorAngle = h, this.glyphAngle = l, this.minScale = r, this.maxScale = s }

            function getIconQuads(t, e, a, n, i, o, h, l, r) {
                var s, c, m, u, g = e.image.rect,
                    f = i.layout,
                    x = 1,
                    y = e.left - x,
                    P = y + g.w / e.image.pixelRatio,
                    M = e.top - x,
                    d = M + g.h / e.image.pixelRatio;
                if ("none" !== f["icon-text-fit"] && h) {
                    var p = P - y,
                        v = d - M,
                        w = f["text-size"] / 24,
                        S = h.left * w,
                        b = h.right * w,
                        I = h.top * w,
                        Q = h.bottom * w,
                        G = b - S,
                        k = Q - I,
                        q = f["icon-text-fit-padding"][0],
                        A = f["icon-text-fit-padding"][1],
                        R = f["icon-text-fit-padding"][2],
                        _ = f["icon-text-fit-padding"][3],
                        z = "width" === f["icon-text-fit"] ? .5 * (k - v) : 0,
                        L = "height" === f["icon-text-fit"] ? .5 * (G - p) : 0,
                        V = "width" === f["icon-text-fit"] || "both" === f["icon-text-fit"] ? G : p,
                        j = "height" === f["icon-text-fit"] || "both" === f["icon-text-fit"] ? k : v;
                    s = new Point(S + L - _, I + z - q), c = new Point(S + L + A + V, I + z - q), m = new Point(S + L + A + V, I + z + R + j), u = new Point(S + L - _, I + z + R + j) } else s = new Point(y, M), c = new Point(P, M), m = new Point(P, d), u = new Point(y, d);
                var B = i.getLayoutValue("icon-rotate", l, r) * Math.PI / 180;
                if (o) {
                    var C = n[t.segment];
                    if (t.y === C.y && t.x === C.x && t.segment + 1 < n.length) {
                        var D = n[t.segment + 1];
                        B += Math.atan2(t.y - D.y, t.x - D.x) + Math.PI } else B += Math.atan2(t.y - C.y, t.x - C.x) }
                if (B) {
                    var E = Math.sin(B),
                        F = Math.cos(B),
                        H = [F, -E, E, F];
                    s = s.matMult(H), c = c.matMult(H), u = u.matMult(H), m = m.matMult(H) }
                return [new SymbolQuad(new Point(t.x, t.y), s, c, u, m, e.image.rect, 0, 0, minScale, 1 / 0)] }

            function getGlyphQuads(t, e, a, n, i, o) {
                for (var h = i.layout["text-rotate"] * Math.PI / 180, l = i.layout["text-keep-upright"], r = e.positionedGlyphs, s = [], c = 0; c < r.length; c++) {
                    var m = r[c],
                        u = m.glyph;
                    if (u) {
                        var g = u.rect;
                        if (g) {
                            var f, x = (m.x + u.advance / 2) * a,
                                y = minScale;
                            o ? (f = [], y = getSegmentGlyphs(f, t, x, n, t.segment, !0), l && (y = Math.min(y, getSegmentGlyphs(f, t, x, n, t.segment, !1)))) : f = [{ anchorPoint: new Point(t.x, t.y), offset: 0, angle: 0, maxScale: 1 / 0, minScale: minScale }];
                            for (var P = m.x + u.left, M = m.y - u.top, d = P + g.w, p = M + g.h, v = new Point(P, M), w = new Point(d, M), S = new Point(P, p), b = new Point(d, p), I = 0; I < f.length; I++) {
                                var Q = f[I],
                                    G = v,
                                    k = w,
                                    q = S,
                                    A = b;
                                if (h) {
                                    var R = Math.sin(h),
                                        _ = Math.cos(h),
                                        z = [_, -R, R, _];
                                    G = G.matMult(z), k = k.matMult(z), q = q.matMult(z), A = A.matMult(z) }
                                var L = Math.max(Q.minScale, y),
                                    V = (t.angle + Q.offset + 2 * Math.PI) % (2 * Math.PI),
                                    j = (Q.angle + Q.offset + 2 * Math.PI) % (2 * Math.PI);
                                s.push(new SymbolQuad(Q.anchorPoint, G, k, q, A, g, V, j, L, Q.maxScale)) } } } }
                return s }

            function getSegmentGlyphs(t, e, a, n, i, o) {
                var h = !o;
                a < 0 && (o = !o), o && i++;
                var l = new Point(e.x, e.y),
                    r = n[i],
                    s = 1 / 0;
                a = Math.abs(a);
                for (var c = minScale;;) {
                    var m = l.dist(r),
                        u = a / m,
                        g = Math.atan2(r.y - l.y, r.x - l.x);
                    if (o || (g += Math.PI), t.push({ anchorPoint: l, offset: h ? Math.PI : 0, minScale: u, maxScale: s, angle: (g + 2 * Math.PI) % (2 * Math.PI) }), u <= c) break;
                    for (l = r; l.equals(r);)
                        if (i += o ? 1 : -1, r = n[i], !r) return u;
                    var f = r.sub(l)._unit();
                    l = l.sub(f._mult(m)), s = u }
                return c }
            var Point = require("point-geometry");
            module.exports = { getIconQuads: getIconQuads, getGlyphQuads: getGlyphQuads, SymbolQuad: SymbolQuad };
            var minScale = .5;
        }, { "point-geometry": 192 }],
        80: [function(require, module, exports) {
            "use strict";

            function resolveText(e, r, o) {
                for (var t = [], s = 0, l = e.length; s < l; s++) {
                    var a = resolveTokens(e[s].properties, r["text-field"]);
                    if (a) { a = a.toString();
                        var n = r["text-transform"]; "uppercase" === n ? a = a.toLocaleUpperCase() : "lowercase" === n && (a = a.toLocaleLowerCase());
                        for (var v = 0; v < a.length; v++) o[a.charCodeAt(v)] = !0;
                        t[s] = a } else t[s] = null }
                return t }
            var resolveTokens = require("../util/token");
            module.exports = resolveText;
        }, { "../util/token": 121 }],
        81: [function(require, module, exports) {
            "use strict";

            function PositionedGlyph(i, t, n, e) { this.codePoint = i, this.x = t, this.y = n, this.glyph = e || null }

            function Shaping(i, t, n, e, o, h) { this.positionedGlyphs = i, this.text = t, this.top = n, this.bottom = e, this.left = o, this.right = h }

            function shapeText(i, t, n, e, o, h, a, s, r) {
                var l = [],
                    f = new Shaping(l, i, r[1], r[1], r[0], r[0]),
                    c = -17,
                    p = 0,
                    u = c;
                i = i.trim();
                for (var v = 0; v < i.length; v++) {
                    var d = i.charCodeAt(v),
                        g = t[d];
                    (g || d === newLine) && (l.push(new PositionedGlyph(d, p, u, g)), g && (p += g.advance + s)) }
                return !!l.length && (linewrap(f, t, e, n, o, h, a, r), f) }

            function linewrap(i, t, n, e, o, h, a, s) {
                var r = null,
                    l = 0,
                    f = 0,
                    c = 0,
                    p = 0,
                    u = i.positionedGlyphs;
                if (e)
                    for (var v = 0; v < u.length; v++) {
                        var d = u[v];
                        if (d.x -= l, d.y += n * c, null !== r && (d.x > e || u[r].codePoint === newLine)) {
                            var g = u[r + 1].x;
                            p = Math.max(g, p);
                            for (var x = r + 1; x <= v; x++) u[x].y += n, u[x].x -= g;
                            if (a) {
                                var b = r;
                                invisible[u[r].codePoint] && b--, justifyLine(u, t, f, b, a) }
                            f = r + 1, r = null, l += g, c++ }
                        breakable[d.codePoint] && (r = v) }
                var w = u[u.length - 1],
                    y = w.x + t[w.codePoint].advance;
                p = Math.max(p, y);
                var P = (c + 1) * n;
                justifyLine(u, t, f, u.length - 1, a), align(u, a, o, h, p, n, c, s), i.top += -h * P, i.bottom = i.top + P, i.left += -o * p, i.right = i.left + p }

            function justifyLine(i, t, n, e, o) {
                for (var h = t[i[e].codePoint].advance, a = (i[e].x + h) * o, s = n; s <= e; s++) i[s].x -= a }

            function align(i, t, n, e, o, h, a, s) {
                for (var r = (t - n) * o + s[0], l = (-e * (a + 1) + .5) * h + s[1], f = 0; f < i.length; f++) i[f].x += r, i[f].y += l }

            function shapeIcon(i, t) {
                if (!i || !i.rect) return null;
                var n = t["icon-offset"][0],
                    e = t["icon-offset"][1],
                    o = n - i.width / 2,
                    h = o + i.width,
                    a = e - i.height / 2,
                    s = a + i.height;
                return new PositionedIcon(i, a, s, o, h) }

            function PositionedIcon(i, t, n, e, o) { this.image = i, this.top = t, this.bottom = n, this.left = e, this.right = o }
            module.exports = { shapeText: shapeText, shapeIcon: shapeIcon };
            var newLine = 10,
                invisible = { 32: !0, 8203: !0 },
                breakable = { 32: !0, 38: !0, 43: !0, 45: !0, 47: !0, 173: !0, 183: !0, 8203: !0, 8208: !0, 8211: !0 };
            invisible[newLine] = breakable[newLine] = !0;
        }, {}],
        82: [function(require, module, exports) {
            "use strict";

            function SpriteAtlas(t, i) { this.width = t, this.height = i, this.bin = new ShelfPack(t, i), this.images = {}, this.data = !1, this.texture = 0, this.filter = 0, this.pixelRatio = 1, this.dirty = !0 }

            function copyBitmap(t, i, e, h, a, s, r, o, l, p, n) {
                var u, R, f = h * i + e,
                    x = o * s + r;
                if (n)
                    for (x -= s, R = -1; R <= p; R++, f = ((R + p) % p + h) * i + e, x += s)
                        for (u = -1; u <= l; u++) a[x + u] = t[f + (u + l) % l];
                else
                    for (R = 0; R < p; R++, f += i, x += s)
                        for (u = 0; u < l; u++) a[x + u] = t[f + u] }

            function AtlasImage(t, i, e, h, a) { this.rect = t, this.width = i, this.height = e, this.sdf = h, this.pixelRatio = a }
            var ShelfPack = require("shelf-pack"),
                browser = require("../util/browser"),
                util = require("../util/util");
            module.exports = SpriteAtlas, SpriteAtlas.prototype.allocateImage = function(t, i) { t /= this.pixelRatio, i /= this.pixelRatio;
                var e = 2,
                    h = t + e + (4 - (t + e) % 4),
                    a = i + e + (4 - (i + e) % 4),
                    s = this.bin.packOne(h, a);
                return s ? s : (util.warnOnce("SpriteAtlas out of space."), null) }, SpriteAtlas.prototype.getImage = function(t, i) {
                if (this.images[t]) return this.images[t];
                if (!this.sprite) return null;
                var e = this.sprite.getSpritePosition(t);
                if (!e.width || !e.height) return null;
                var h = this.allocateImage(e.width, e.height);
                if (!h) return null;
                var a = new AtlasImage(h, e.width / e.pixelRatio, e.height / e.pixelRatio, e.sdf, e.pixelRatio / this.pixelRatio);
                return this.images[t] = a, this.copy(h, e, i), a }, SpriteAtlas.prototype.getPosition = function(t, i) {
                var e = this.getImage(t, i),
                    h = e && e.rect;
                if (!h) return null;
                var a = e.width * e.pixelRatio,
                    s = e.height * e.pixelRatio,
                    r = 1;
                return { size: [e.width, e.height], tl: [(h.x + r) / this.width, (h.y + r) / this.height], br: [(h.x + r + a) / this.width, (h.y + r + s) / this.height] } }, SpriteAtlas.prototype.allocate = function() {
                if (!this.data) {
                    var t = Math.floor(this.width * this.pixelRatio),
                        i = Math.floor(this.height * this.pixelRatio);
                    this.data = new Uint32Array(t * i);
                    for (var e = 0; e < this.data.length; e++) this.data[e] = 0 } }, SpriteAtlas.prototype.copy = function(t, i, e) {
                if (this.sprite.img.data) {
                    var h = new Uint32Array(this.sprite.img.data.buffer);
                    this.allocate();
                    var a = this.data,
                        s = 1;
                    copyBitmap(h, this.sprite.img.width, i.x, i.y, a, this.width * this.pixelRatio, (t.x + s) * this.pixelRatio, (t.y + s) * this.pixelRatio, i.width, i.height, e), this.dirty = !0 } }, SpriteAtlas.prototype.setSprite = function(t) { t && (this.pixelRatio = browser.devicePixelRatio > 1 ? 2 : 1, this.canvas && (this.canvas.width = this.width * this.pixelRatio, this.canvas.height = this.height * this.pixelRatio)), this.sprite = t }, SpriteAtlas.prototype.addIcons = function(t, i) {
                for (var e = 0; e < t.length; e++) this.getImage(t[e]);
                i(null, this.images) }, SpriteAtlas.prototype.bind = function(t, i) {
                var e = !1;
                this.texture ? t.bindTexture(t.TEXTURE_2D, this.texture) : (this.texture = t.createTexture(), t.bindTexture(t.TEXTURE_2D, this.texture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), e = !0);
                var h = i ? t.LINEAR : t.NEAREST;
                h !== this.filter && (t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, h), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, h), this.filter = h), this.dirty && (this.allocate(), e ? t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, this.width * this.pixelRatio, this.height * this.pixelRatio, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)) : t.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(this.data.buffer)), this.dirty = !1) };
        }, { "../util/browser": 105, "../util/util": 122, "shelf-pack": 194 }],
        83: [function(require, module, exports) {
            "use strict";
            var StructArrayType = require("../util/struct_array"),
                util = require("../util/util"),
                Point = require("point-geometry"),
                SymbolInstancesArray = module.exports = new StructArrayType({ members: [{ type: "Uint16", name: "textBoxStartIndex" }, { type: "Uint16", name: "textBoxEndIndex" }, { type: "Uint16", name: "iconBoxStartIndex" }, { type: "Uint16", name: "iconBoxEndIndex" }, { type: "Uint16", name: "glyphQuadStartIndex" }, { type: "Uint16", name: "glyphQuadEndIndex" }, { type: "Uint16", name: "iconQuadStartIndex" }, { type: "Uint16", name: "iconQuadEndIndex" }, { type: "Int16", name: "anchorPointX" }, { type: "Int16", name: "anchorPointY" }, { type: "Int8", name: "index" }] });
            util.extendAll(SymbolInstancesArray.prototype.StructType.prototype, {get anchorPoint() {
                    return new Point(this.anchorPointX, this.anchorPointY) } });
        }, { "../util/struct_array": 120, "../util/util": 122, "point-geometry": 192 }],
        84: [function(require, module, exports) {
            "use strict";
            var StructArrayType = require("../util/struct_array"),
                util = require("../util/util"),
                Point = require("point-geometry"),
                SymbolQuad = require("./quads").SymbolQuad,
                SymbolQuadsArray = module.exports = new StructArrayType({ members: [{ type: "Int16", name: "anchorPointX" }, { type: "Int16", name: "anchorPointY" }, { type: "Float32", name: "tlX" }, { type: "Float32", name: "tlY" }, { type: "Float32", name: "trX" }, { type: "Float32", name: "trY" }, { type: "Float32", name: "blX" }, { type: "Float32", name: "blY" }, { type: "Float32", name: "brX" }, { type: "Float32", name: "brY" }, { type: "Int16", name: "texH" }, { type: "Int16", name: "texW" }, { type: "Int16", name: "texX" }, { type: "Int16", name: "texY" }, { type: "Float32", name: "anchorAngle" }, { type: "Float32", name: "glyphAngle" }, { type: "Float32", name: "maxScale" }, { type: "Float32", name: "minScale" }] });
            util.extendAll(SymbolQuadsArray.prototype.StructType.prototype, {get anchorPoint() {
                    return new Point(this.anchorPointX, this.anchorPointY) }, get SymbolQuad() {
                    return new SymbolQuad(this.anchorPoint, new Point(this.tlX, this.tlY), new Point(this.trX, this.trY), new Point(this.blX, this.blY), new Point(this.brX, this.brY), { x: this.texX, y: this.texY, h: this.texH, w: this.texW, height: this.texH, width: this.texW }, this.anchorAngle, this.glyphAngle, this.minScale, this.maxScale) } });
        }, { "../util/struct_array": 120, "../util/util": 122, "./quads": 79, "point-geometry": 192 }],
        85: [function(require, module, exports) {
            "use strict";
            var DOM = require("../util/dom"),
                Point = require("point-geometry"),
                handlers = { scrollZoom: require("./handler/scroll_zoom"), boxZoom: require("./handler/box_zoom"), dragRotate: require("./handler/drag_rotate"), dragPan: require("./handler/drag_pan"), keyboard: require("./handler/keyboard"), doubleClickZoom: require("./handler/dblclick_zoom"), touchZoomRotate: require("./handler/touch_zoom_rotate") };
            module.exports = function(e, t) {
                function n(e) { h("mouseout", e) }

                function o(t) { e.stop(), E = DOM.mousePos(g, t), h("mousedown", t) }

                function r(t) {
                    var n = e.dragRotate && e.dragRotate.isActive();
                    p && !n && h("contextmenu", p), p = null, h("mouseup", t) }

                function u(t) {
                    if (!(e.dragPan && e.dragPan.isActive() || e.dragRotate && e.dragRotate.isActive())) {
                        for (var n = t.toElement || t.target; n && n !== g;) n = n.parentNode;
                        n === g && h("mousemove", t) } }

                function a(t) { e.stop(), f("touchstart", t), !t.touches || t.touches.length > 1 || (L ? (clearTimeout(L), L = null, h("dblclick", t)) : L = setTimeout(l, 300)) }

                function i(e) { f("touchmove", e) }

                function c(e) { f("touchend", e) }

                function d(e) { f("touchcancel", e) }

                function l() { L = null }

                function s(e) {
                    var t = DOM.mousePos(g, e);
                    t.equals(E) && h("click", e) }

                function v(e) { h("dblclick", e), e.preventDefault() }

                function m(e) { p = e, e.preventDefault() }

                function h(t, n) {
                    var o = DOM.mousePos(g, n);
                    return e.fire(t, { lngLat: e.unproject(o), point: o, originalEvent: n }) }

                function f(t, n) {
                    var o = DOM.touchPos(g, n),
                        r = o.reduce(function(e, t, n, o) {
                            return e.add(t.div(o.length)) }, new Point(0, 0));
                    return e.fire(t, { lngLat: e.unproject(r), point: r, lngLats: o.map(function(t) {
                            return e.unproject(t) }, this), points: o, originalEvent: n }) }
                var g = e.getCanvasContainer(),
                    p = null,
                    E = null,
                    L = null;
                for (var b in handlers) e[b] = new handlers[b](e, t), t.interactive && t[b] && e[b].enable();
                g.addEventListener("mouseout", n, !1), g.addEventListener("mousedown", o, !1), g.addEventListener("mouseup", r, !1), g.addEventListener("mousemove", u, !1), g.addEventListener("touchstart", a, !1), g.addEventListener("touchend", c, !1), g.addEventListener("touchmove", i, !1), g.addEventListener("touchcancel", d, !1), g.addEventListener("click", s, !1), g.addEventListener("dblclick", v, !1), g.addEventListener("contextmenu", m, !1) };
        }, { "../util/dom": 112, "./handler/box_zoom": 92, "./handler/dblclick_zoom": 93, "./handler/drag_pan": 94, "./handler/drag_rotate": 95, "./handler/keyboard": 96, "./handler/scroll_zoom": 97, "./handler/touch_zoom_rotate": 98, "point-geometry": 192 }],
        86: [function(require, module, exports) {
            "use strict";
            var util = require("../util/util"),
                interpolate = require("../util/interpolate"),
                browser = require("../util/browser"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                Camera = module.exports = function() {};
            util.extend(Camera.prototype, { getCenter: function() {
                    return this.transform.center }, setCenter: function(t, i) {
                    return this.jumpTo({ center: t }, i), this }, panBy: function(t, i, e) {
                    return this.panTo(this.transform.center, util.extend({ offset: Point.convert(t).mult(-1) }, i), e), this }, panTo: function(t, i, e) {
                    return this.easeTo(util.extend({ center: t }, i), e) }, getZoom: function() {
                    return this.transform.zoom }, setZoom: function(t, i) {
                    return this.jumpTo({ zoom: t }, i), this }, zoomTo: function(t, i, e) {
                    return this.easeTo(util.extend({ zoom: t }, i), e) }, zoomIn: function(t, i) {
                    return this.zoomTo(this.getZoom() + 1, t, i), this }, zoomOut: function(t, i) {
                    return this.zoomTo(this.getZoom() - 1, t, i), this }, getBearing: function() {
                    return this.transform.bearing }, setBearing: function(t, i) {
                    return this.jumpTo({ bearing: t }, i), this }, rotateTo: function(t, i, e) {
                    return this.easeTo(util.extend({ bearing: t }, i), e) }, resetNorth: function(t, i) {
                    return this.rotateTo(0, util.extend({ duration: 1e3 }, t), i), this }, snapToNorth: function(t, i) {
                    return Math.abs(this.getBearing()) < this._bearingSnap ? this.resetNorth(t, i) : this }, getPitch: function() {
                    return this.transform.pitch }, setPitch: function(t, i) {
                    return this.jumpTo({ pitch: t }, i), this }, fitBounds: function(t, i, e) { i = util.extend({ padding: 0, offset: [0, 0], maxZoom: 1 / 0 }, i), t = LngLatBounds.convert(t);
                    var n = Point.convert(i.offset),
                        o = this.transform,
                        r = o.project(t.getNorthWest()),
                        s = o.project(t.getSouthEast()),
                        a = s.sub(r),
                        h = (o.width - 2 * i.padding - 2 * Math.abs(n.x)) / a.x,
                        u = (o.height - 2 * i.padding - 2 * Math.abs(n.y)) / a.y;
                    return i.center = o.unproject(r.add(s).div(2)), i.zoom = Math.min(o.scaleZoom(o.scale * Math.min(h, u)), i.maxZoom), i.bearing = 0, i.linear ? this.easeTo(i, e) : this.flyTo(i, e) }, jumpTo: function(t, i) { this.stop();
                    var e = this.transform,
                        n = !1,
                        o = !1,
                        r = !1;
                    return "zoom" in t && e.zoom !== +t.zoom && (n = !0, e.zoom = +t.zoom), "center" in t && (e.center = LngLat.convert(t.center)), "bearing" in t && e.bearing !== +t.bearing && (o = !0, e.bearing = +t.bearing), "pitch" in t && e.pitch !== +t.pitch && (r = !0, e.pitch = +t.pitch), this.fire("movestart", i).fire("move", i), n && this.fire("zoomstart", i).fire("zoom", i).fire("zoomend", i), o && this.fire("rotate", i), r && this.fire("pitch", i), this.fire("moveend", i) }, easeTo: function(t, i) { this.stop(), t = util.extend({ offset: [0, 0], duration: 500, easing: util.ease }, t);
                    var e, n, o = this.transform,
                        r = Point.convert(t.offset),
                        s = this.getZoom(),
                        a = this.getBearing(),
                        h = this.getPitch(),
                        u = "zoom" in t ? +t.zoom : s,
                        c = "bearing" in t ? this._normalizeBearing(t.bearing, a) : a,
                        m = "pitch" in t ? +t.pitch : h; "center" in t ? (e = LngLat.convert(t.center), n = o.centerPoint.add(r)) : "around" in t ? (e = LngLat.convert(t.around), n = o.locationPoint(e)) : (n = o.centerPoint.add(r), e = o.pointLocation(n));
                    var g = o.locationPoint(e);
                    return t.animate === !1 && (t.duration = 0), this.zooming = u !== s, this.rotating = a !== c, this.pitching = m !== h, t.smoothEasing && 0 !== t.duration && (t.easing = this._smoothOutEasing(t.duration)), t.noMoveStart || this.fire("movestart", i), this.zooming && this.fire("zoomstart", i), clearTimeout(this._onEaseEnd), this._ease(function(t) { this.zooming && (o.zoom = interpolate(s, u, t)), this.rotating && (o.bearing = interpolate(a, c, t)), this.pitching && (o.pitch = interpolate(h, m, t)), o.setLocationAtPoint(e, g.add(n.sub(g)._mult(t))), this.fire("move", i), this.zooming && this.fire("zoom", i), this.rotating && this.fire("rotate", i), this.pitching && this.fire("pitch", i) }, function() { t.delayEndEvents ? this._onEaseEnd = setTimeout(this._easeToEnd.bind(this, i), t.delayEndEvents) : this._easeToEnd(i) }.bind(this), t), this }, _easeToEnd: function(t) {
                    var i = this.zooming;
                    this.zooming = !1, this.rotating = !1, this.pitching = !1, i && this.fire("zoomend", t), this.fire("moveend", t) }, flyTo: function(t, i) {
                    function e(t) {
                        var i = (M * M - _ * _ + (t ? -1 : 1) * L * L * T * T) / (2 * (t ? M : _) * L * T);
                        return Math.log(Math.sqrt(i * i + 1) - i) }

                    function n(t) {
                        return (Math.exp(t) - Math.exp(-t)) / 2 }

                    function o(t) {
                        return (Math.exp(t) + Math.exp(-t)) / 2 }

                    function r(t) {
                        return n(t) / o(t) }
                    this.stop(), t = util.extend({ offset: [0, 0], speed: 1.2, curve: 1.42, easing: util.ease }, t);
                    var s = this.transform,
                        a = Point.convert(t.offset),
                        h = this.getZoom(),
                        u = this.getBearing(),
                        c = this.getPitch(),
                        m = "center" in t ? LngLat.convert(t.center) : this.getCenter(),
                        g = "zoom" in t ? +t.zoom : h,
                        f = "bearing" in t ? this._normalizeBearing(t.bearing, u) : u,
                        d = "pitch" in t ? +t.pitch : c;
                    Math.abs(s.center.lng) + Math.abs(m.lng) > 180 && (s.center.lng > 0 && m.lng < 0 ? m.lng += 360 : s.center.lng < 0 && m.lng > 0 && (m.lng -= 360));
                    var p = s.zoomScale(g - h),
                        l = s.point,
                        v = "center" in t ? s.project(m).sub(a.div(p)) : l,
                        b = s.worldSize,
                        z = t.curve,
                        _ = Math.max(s.width, s.height),
                        M = _ / p,
                        T = v.sub(l).mag();
                    if ("minZoom" in t) {
                        var E = util.clamp(Math.min(t.minZoom, h, g), s.minZoom, s.maxZoom),
                            x = _ / s.zoomScale(E - h);
                        z = Math.sqrt(x / T * 2) }
                    var L = z * z,
                        P = e(0),
                        Z = function(t) {
                            return o(P) / o(P + z * t) },
                        B = function(t) {
                            return _ * ((o(P) * r(P + z * t) - n(P)) / L) / T },
                        j = (e(1) - P) / z;
                    if (Math.abs(T) < 1e-6) {
                        if (Math.abs(_ - M) < 1e-6) return this.easeTo(t);
                        var q = M < _ ? -1 : 1;
                        j = Math.abs(Math.log(M / _)) / z, B = function() {
                            return 0 }, Z = function(t) {
                            return Math.exp(q * z * t) } }
                    if ("duration" in t) t.duration = +t.duration;
                    else {
                        var w = "screenSpeed" in t ? +t.screenSpeed / z : +t.speed;
                        t.duration = 1e3 * j / w }
                    return this.zooming = !0, u !== f && (this.rotating = !0), c !== d && (this.pitching = !0), this.fire("movestart", i), this.fire("zoomstart", i), this._ease(function(t) {
                        var e = t * j,
                            n = B(e);
                        s.zoom = h + s.scaleZoom(1 / Z(e)), s.center = s.unproject(l.add(v.sub(l).mult(n)), b), this.rotating && (s.bearing = interpolate(u, f, t)), this.pitching && (s.pitch = interpolate(c, d, t)), this.fire("move", i), this.fire("zoom", i), this.rotating && this.fire("rotate", i), this.pitching && this.fire("pitch", i) }, function() { this.zooming = !1, this.rotating = !1, this.pitching = !1, this.fire("zoomend", i), this.fire("moveend", i) }, t), this }, isEasing: function() {
                    return !!this._abortFn }, stop: function() {
                    return this._abortFn && (this._abortFn(), this._finishEase()), this }, _ease: function(t, i, e) { this._finishFn = i, this._abortFn = browser.timed(function(i) { t.call(this, e.easing(i)), 1 === i && this._finishEase() }, e.animate === !1 ? 0 : e.duration, this) }, _finishEase: function() { delete this._abortFn;
                    var t = this._finishFn;
                    delete this._finishFn, t.call(this) }, _normalizeBearing: function(t, i) { t = util.wrap(t, -180, 180);
                    var e = Math.abs(t - i);
                    return Math.abs(t - 360 - i) < e && (t -= 360), Math.abs(t + 360 - i) < e && (t += 360), t }, _smoothOutEasing: function(t) {
                    var i = util.ease;
                    if (this._prevEase) {
                        var e = this._prevEase,
                            n = (Date.now() - e.start) / e.duration,
                            o = e.easing(n + .01) - e.easing(n),
                            r = .27 / Math.sqrt(o * o + 1e-4) * .01,
                            s = Math.sqrt(.0729 - r * r);
                        i = util.bezier(r, s, .25, 1) }
                    return this._prevEase = { start: (new Date).getTime(), duration: t, easing: i }, i } });
        }, { "../geo/lng_lat": 13, "../geo/lng_lat_bounds": 14, "../util/browser": 105, "../util/interpolate": 116, "../util/util": 122, "point-geometry": 192 }],
        87: [function(require, module, exports) {
            "use strict";

            function AttributionControl(t) { util.setOptions(this, t) }
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util");
            module.exports = AttributionControl, AttributionControl.prototype = util.inherit(Control, { options: { position: "bottom-right" }, onAdd: function(t) {
                    var i = "mapboxgl-ctrl-attrib",
                        n = this._container = DOM.create("div", i, t.getContainer());
                    return this._updateAttributions(), this._updateEditLink(), t.on("data", function(t) { "source" === t.dataType && (this._updateAttributions(), this._updateEditLink()) }.bind(this)), t.on("moveend", this._updateEditLink.bind(this)), n }, _updateAttributions: function() {
                    if (this._map.style) {
                        var t = [],
                            i = this._map.style.sourceCaches;
                        for (var n in i) {
                            var o = i[n].getSource();
                            o.attribution && t.indexOf(o.attribution) < 0 && t.push(o.attribution) }
                        t.sort(function(t, i) {
                            return t.length - i.length }), t = t.filter(function(i, n) {
                            for (var o = n + 1; o < t.length; o++)
                                if (t[o].indexOf(i) >= 0) return !1;
                            return !0 }), this._container.innerHTML = t.join(" | "), this._editLink = null } }, _updateEditLink: function() {
                    if (this._editLink || (this._editLink = this._container.querySelector(".mapbox-improve-map")), this._editLink) {
                        var t = this._map.getCenter();
                        this._editLink.href = "https://www.mapbox.com/map-feedback/#/" + t.lng + "/" + t.lat + "/" + Math.round(this._map.getZoom() + 1) } } });
        }, { "../../util/dom": 112, "../../util/util": 122, "./control": 88 }],
        88: [function(require, module, exports) {
            "use strict";

            function Control() {}
            var util = require("../../util/util"),
                Evented = require("../../util/evented");
            module.exports = Control, Control.prototype = { addTo: function(t) { this._map = t;
                    var o = this._container = this.onAdd(t);
                    if (this.options && this.options.position) {
                        var i = this.options.position,
                            e = t._controlCorners[i];
                        o.className += " mapboxgl-ctrl", i.indexOf("bottom") !== -1 ? e.insertBefore(o, e.firstChild) : e.appendChild(o) }
                    return this }, remove: function() {
                    return this._container.parentNode.removeChild(this._container), this.onRemove && this.onRemove(this._map), this._map = null, this } }, util.extend(Control.prototype, Evented);
        }, { "../../util/evented": 113, "../../util/util": 122 }],
        89: [function(require, module, exports) {
            "use strict";

            function GeolocateControl(t) { util.setOptions(this, t) }
            var Control = require("./control"),
                browser = require("../../util/browser"),
                DOM = require("../../util/dom"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = GeolocateControl;
            var geoOptions = { enableHighAccuracy: !1, timeout: 6e3 };
            GeolocateControl.prototype = util.inherit(Control, { options: { position: "top-right" }, onAdd: function(t) {
                    var o = "mapboxgl-ctrl",
                        i = this._container = DOM.create("div", o + "-group", t.getContainer());
                    return browser.supportsGeolocation ? (this._container.addEventListener("contextmenu", this._onContextMenu.bind(this)), this._geolocateButton = DOM.create("button", o + "-icon " + o + "-geolocate", this._container), this._geolocateButton.type = "button", this._geolocateButton.addEventListener("click", this._onClickGeolocate.bind(this)), i) : i }, _onContextMenu: function(t) { t.preventDefault() }, _onClickGeolocate: function() { window.navigator.geolocation.getCurrentPosition(this._success.bind(this), this._error.bind(this), geoOptions), this._timeoutId = setTimeout(this._finish.bind(this), 1e4) }, _success: function(t) { this._map.jumpTo({ center: [t.coords.longitude, t.coords.latitude], zoom: 17, bearing: 0, pitch: 0 }), this.fire("geolocate", t), this._finish() }, _error: function(t) { this.fire("error", t), this._finish() }, _finish: function() { this._timeoutId && clearTimeout(this._timeoutId), this._timeoutId = void 0 } });
        }, { "../../util/browser": 105, "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107, "./control": 88 }],
        90: [function(require, module, exports) {
            "use strict";

            function NavigationControl(t) { util.setOptions(this, t) }

            function copyMouseEvent(t) {
                return new window.MouseEvent(t.type, { button: 2, buttons: 2, bubbles: !0, cancelable: !0, detail: t.detail, view: t.view, screenX: t.screenX, screenY: t.screenY, clientX: t.clientX, clientY: t.clientY, movementX: t.movementX, movementY: t.movementY, ctrlKey: t.ctrlKey, shiftKey: t.shiftKey, altKey: t.altKey, metaKey: t.metaKey }) }
            var Control = require("./control"),
                DOM = require("../../util/dom"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = NavigationControl, NavigationControl.prototype = util.inherit(Control, { options: { position: "top-right" }, onAdd: function(t) {
                    var o = "mapboxgl-ctrl",
                        e = this._container = DOM.create("div", o + "-group", t.getContainer());
                    return this._container.addEventListener("contextmenu", this._onContextMenu.bind(this)), this._zoomInButton = this._createButton(o + "-icon " + o + "-zoom-in", t.zoomIn.bind(t)), this._zoomOutButton = this._createButton(o + "-icon " + o + "-zoom-out", t.zoomOut.bind(t)), this._compass = this._createButton(o + "-icon " + o + "-compass", t.resetNorth.bind(t)), this._compassArrow = DOM.create("span", "arrow", this._compass), this._compass.addEventListener("mousedown", this._onCompassDown.bind(this)), this._onCompassMove = this._onCompassMove.bind(this), this._onCompassUp = this._onCompassUp.bind(this), t.on("rotate", this._rotateCompassArrow.bind(this)), this._rotateCompassArrow(), this._el = t.getCanvasContainer(), e }, _onContextMenu: function(t) { t.preventDefault() }, _onCompassDown: function(t) { 0 === t.button && (DOM.disableDrag(), window.document.addEventListener("mousemove", this._onCompassMove), window.document.addEventListener("mouseup", this._onCompassUp), this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation()) }, _onCompassMove: function(t) { 0 === t.button && (this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation()) }, _onCompassUp: function(t) { 0 === t.button && (window.document.removeEventListener("mousemove", this._onCompassMove), window.document.removeEventListener("mouseup", this._onCompassUp), DOM.enableDrag(), this._el.dispatchEvent(copyMouseEvent(t)), t.stopPropagation()) }, _createButton: function(t, o) {
                    var e = DOM.create("button", t, this._container);
                    return e.type = "button", e.addEventListener("click", function() { o() }), e }, _rotateCompassArrow: function() {
                    var t = "rotate(" + this._map.transform.angle * (180 / Math.PI) + "deg)";
                    this._compassArrow.style.transform = t } });
        }, { "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107, "./control": 88 }],
        91: [function(require, module, exports) {
            "use strict";

            function ScaleControl(t) { util.setOptions(this, t) }

            function updateScale(t, e, n) {
                var o = n && n.maxWidth || 100,
                    i = t._container.clientHeight / 2,
                    a = getDistance(t.unproject([0, i]), t.unproject([o, i]));
                if (n && "imperial" === n.unit) {
                    var r = 3.2808 * a;
                    if (r > 5280) {
                        var l = r / 5280;
                        setScale(e, o, l, "mi") } else setScale(e, o, r, "ft") } else setScale(e, o, a, "m") }

            function setScale(t, e, n, o) {
                var i = getRoundNum(n),
                    a = i / n; "m" === o && i >= 1e3 && (i /= 1e3, o = "km"), t.style.width = e * a + "px", t.innerHTML = i + o }

            function getDistance(t, e) {
                var n = 6371e3,
                    o = Math.PI / 180,
                    i = t.lat * o,
                    a = e.lat * o,
                    r = Math.sin(i) * Math.sin(a) + Math.cos(i) * Math.cos(a) * Math.cos((e.lng - t.lng) * o),
                    l = n * Math.acos(Math.min(r, 1));
                return l }

            function getRoundNum(t) {
                var e = Math.pow(10, (Math.floor(t) + "").length - 1),
                    n = t / e;
                return n = n >= 10 ? 10 : n >= 5 ? 5 : n >= 3 ? 3 : n >= 2 ? 2 : 1, e * n }
            var util = require("../../util/util"),
                Control = require("./control"),
                DOM = require("../../util/dom");
            module.exports = ScaleControl, ScaleControl.prototype = util.inherit(Control, { options: { position: "bottom-left" }, onAdd: function(t) {
                    var e = "mapboxgl-ctrl-scale",
                        n = this._container = DOM.create("div", e, t.getContainer()),
                        o = this.options;
                    return updateScale(t, n, o), t.on("move", function() { updateScale(t, n, o) }), n } });
        }, { "../../util/dom": 112, "../../util/util": 122, "./control": 88 }],
        92: [function(require, module, exports) {
            "use strict";

            function BoxZoomHandler(e) { this._map = e, this._el = e.getCanvasContainer(), this._container = e.getContainer(), util.bindHandlers(this) }
            var DOM = require("../../util/dom"),
                LngLatBounds = require("../../geo/lng_lat_bounds"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = BoxZoomHandler, BoxZoomHandler.prototype = { _enabled: !1, _active: !1, isEnabled: function() {
                    return this._enabled }, isActive: function() {
                    return this._active }, enable: function() { this.isEnabled() || (this._el.addEventListener("mousedown", this._onMouseDown, !1), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("mousedown", this._onMouseDown), this._enabled = !1) }, _onMouseDown: function(e) { e.shiftKey && 0 === e.button && (window.document.addEventListener("mousemove", this._onMouseMove, !1), window.document.addEventListener("keydown", this._onKeyDown, !1), window.document.addEventListener("mouseup", this._onMouseUp, !1), DOM.disableDrag(), this._startPos = DOM.mousePos(this._el, e), this._active = !0) }, _onMouseMove: function(e) {
                    var t = this._startPos,
                        o = DOM.mousePos(this._el, e);
                    this._box || (this._box = DOM.create("div", "mapboxgl-boxzoom", this._container), this._container.classList.add("mapboxgl-crosshair"), this._fireEvent("boxzoomstart", e));
                    var n = Math.min(t.x, o.x),
                        i = Math.max(t.x, o.x),
                        s = Math.min(t.y, o.y),
                        a = Math.max(t.y, o.y);
                    DOM.setTransform(this._box, "translate(" + n + "px," + s + "px)"), this._box.style.width = i - n + "px", this._box.style.height = a - s + "px" }, _onMouseUp: function(e) {
                    if (0 === e.button) {
                        var t = this._startPos,
                            o = DOM.mousePos(this._el, e),
                            n = (new LngLatBounds).extend(this._map.unproject(t)).extend(this._map.unproject(o));
                        this._finish(), t.x === o.x && t.y === o.y ? this._fireEvent("boxzoomcancel", e) : this._map.fitBounds(n, { linear: !0 }).fire("boxzoomend", { originalEvent: e, boxZoomBounds: n }) } }, _onKeyDown: function(e) { 27 === e.keyCode && (this._finish(), this._fireEvent("boxzoomcancel", e)) }, _finish: function() { this._active = !1, window.document.removeEventListener("mousemove", this._onMouseMove, !1), window.document.removeEventListener("keydown", this._onKeyDown, !1), window.document.removeEventListener("mouseup", this._onMouseUp, !1), this._container.classList.remove("mapboxgl-crosshair"), this._box && (this._box.parentNode.removeChild(this._box), this._box = null), DOM.enableDrag() }, _fireEvent: function(e, t) {
                    return this._map.fire(e, { originalEvent: t }) } };
        }, { "../../geo/lng_lat_bounds": 14, "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107 }],
        93: [function(require, module, exports) {
            "use strict";

            function DoubleClickZoomHandler(i) { this._map = i, this._onDblClick = this._onDblClick.bind(this) }
            module.exports = DoubleClickZoomHandler, DoubleClickZoomHandler.prototype = { _enabled: !1, isEnabled: function() {
                    return this._enabled }, enable: function() { this.isEnabled() || (this._map.on("dblclick", this._onDblClick), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._map.off("dblclick", this._onDblClick), this._enabled = !1) }, _onDblClick: function(i) { this._map.zoomTo(this._map.getZoom() + (i.originalEvent.shiftKey ? -1 : 1), { around: i.lngLat }, i) } };
        }, {}],
        94: [function(require, module, exports) {
            "use strict";

            function DragPanHandler(t) { this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this) }
            var DOM = require("../../util/dom"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = DragPanHandler;
            var inertiaLinearity = .3,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaMaxSpeed = 1400,
                inertiaDeceleration = 2500;
            DragPanHandler.prototype = { _enabled: !1, _active: !1, isEnabled: function() {
                    return this._enabled }, isActive: function() {
                    return this._active }, enable: function() { this.isEnabled() || (this._el.addEventListener("mousedown", this._onDown), this._el.addEventListener("touchstart", this._onDown), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("mousedown", this._onDown), this._el.removeEventListener("touchstart", this._onDown), this._enabled = !1) }, _onDown: function(t) { this._ignoreEvent(t) || this.isActive() || (t.touches ? (window.document.addEventListener("touchmove", this._onMove), window.document.addEventListener("touchend", this._onTouchEnd)) : (window.document.addEventListener("mousemove", this._onMove), window.document.addEventListener("mouseup", this._onMouseUp)), this._active = !1, this._startPos = this._pos = DOM.mousePos(this._el, t), this._inertia = [
                        [Date.now(), this._pos]
                    ]) }, _onMove: function(t) {
                    if (!this._ignoreEvent(t)) { this.isActive() || (this._active = !0, this._fireEvent("dragstart", t), this._fireEvent("movestart", t));
                        var e = DOM.mousePos(this._el, t),
                            i = this._map;
                        i.stop(), this._drainInertiaBuffer(), this._inertia.push([Date.now(), e]), i.transform.setLocationAtPoint(i.transform.pointLocation(this._pos), e), this._fireEvent("drag", t), this._fireEvent("move", t), this._pos = e, t.preventDefault() } }, _onUp: function(t) {
                    if (this.isActive()) { this._active = !1, this._fireEvent("dragend", t), this._drainInertiaBuffer();
                        var e = function() { this._fireEvent("moveend", t) }.bind(this),
                            i = this._inertia;
                        if (i.length < 2) return void e();
                        var n = i[i.length - 1],
                            o = i[0],
                            r = n[1].sub(o[1]),
                            s = (n[0] - o[0]) / 1e3;
                        if (0 === s || n[1].equals(o[1])) return void e();
                        var a = r.mult(inertiaLinearity / s),
                            u = a.mag();
                        u > inertiaMaxSpeed && (u = inertiaMaxSpeed, a._unit()._mult(u));
                        var h = u / (inertiaDeceleration * inertiaLinearity),
                            v = a.mult(-h / 2);
                        this._map.panBy(v, { duration: 1e3 * h, easing: inertiaEasing, noMoveStart: !0 }, { originalEvent: t }) } }, _onMouseUp: function(t) { this._ignoreEvent(t) || (this._onUp(t), window.document.removeEventListener("mousemove", this._onMove), window.document.removeEventListener("mouseup", this._onMouseUp)) }, _onTouchEnd: function(t) { this._ignoreEvent(t) || (this._onUp(t), window.document.removeEventListener("touchmove", this._onMove), window.document.removeEventListener("touchend", this._onTouchEnd)) }, _fireEvent: function(t, e) {
                    return this._map.fire(t, { originalEvent: e }) }, _ignoreEvent: function(t) {
                    var e = this._map;
                    if (e.boxZoom && e.boxZoom.isActive()) return !0;
                    if (e.dragRotate && e.dragRotate.isActive()) return !0;
                    if (t.touches) return t.touches.length > 1;
                    if (t.ctrlKey) return !0;
                    var i = 1,
                        n = 0;
                    return "mousemove" === t.type ? t.buttons & 0 === i : t.button !== n }, _drainInertiaBuffer: function() {
                    for (var t = this._inertia, e = Date.now(), i = 160; t.length > 0 && e - t[0][0] > i;) t.shift() } };
        }, { "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107 }],
        95: [function(require, module, exports) {
            "use strict";

            function DragRotateHandler(t, e) { this._map = t, this._el = t.getCanvasContainer(), this._bearingSnap = e.bearingSnap, this._pitchWithRotate = e.pitchWithRotate !== !1, util.bindHandlers(this) }
            var DOM = require("../../util/dom"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = DragRotateHandler;
            var inertiaLinearity = .25,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaMaxSpeed = 180,
                inertiaDeceleration = 720;
            DragRotateHandler.prototype = { _enabled: !1, _active: !1, isEnabled: function() {
                    return this._enabled }, isActive: function() {
                    return this._active }, enable: function() { this.isEnabled() || (this._el.addEventListener("mousedown", this._onDown), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("mousedown", this._onDown), this._enabled = !1) }, _onDown: function(t) { this._ignoreEvent(t) || this.isActive() || (window.document.addEventListener("mousemove", this._onMove), window.document.addEventListener("mouseup", this._onUp), this._active = !1, this._inertia = [
                        [Date.now(), this._map.getBearing()]
                    ], this._startPos = this._pos = DOM.mousePos(this._el, t), this._center = this._map.transform.centerPoint, t.preventDefault()) }, _onMove: function(t) {
                    if (!this._ignoreEvent(t)) { this.isActive() || (this._active = !0, this._fireEvent("rotatestart", t), this._fireEvent("movestart", t));
                        var e = this._map;
                        e.stop();
                        var i = this._pos,
                            n = DOM.mousePos(this._el, t),
                            r = .8 * (i.x - n.x),
                            a = (i.y - n.y) * -.5,
                            o = e.getBearing() - r,
                            s = e.getPitch() - a,
                            h = this._inertia,
                            _ = h[h.length - 1];
                        this._drainInertiaBuffer(), h.push([Date.now(), e._normalizeBearing(o, _[1])]), e.transform.bearing = o, this._pitchWithRotate && (e.transform.pitch = s), this._fireEvent("rotate", t), this._fireEvent("move", t), this._pos = n } }, _onUp: function(t) {
                    if (!this._ignoreEvent(t) && (window.document.removeEventListener("mousemove", this._onMove), window.document.removeEventListener("mouseup", this._onUp), this.isActive())) { this._active = !1, this._fireEvent("rotateend", t), this._drainInertiaBuffer();
                        var e = this._map,
                            i = e.getBearing(),
                            n = this._inertia,
                            r = function() { Math.abs(i) < this._bearingSnap ? e.resetNorth({ noMoveStart: !0 }, { originalEvent: t }) : this._fireEvent("moveend", t) }.bind(this);
                        if (n.length < 2) return void r();
                        var a = n[0],
                            o = n[n.length - 1],
                            s = n[n.length - 2],
                            h = e._normalizeBearing(i, s[1]),
                            _ = o[1] - a[1],
                            v = _ < 0 ? -1 : 1,
                            u = (o[0] - a[0]) / 1e3;
                        if (0 === _ || 0 === u) return void r();
                        var d = Math.abs(_ * (inertiaLinearity / u));
                        d > inertiaMaxSpeed && (d = inertiaMaxSpeed);
                        var l = d / (inertiaDeceleration * inertiaLinearity),
                            c = v * d * (l / 2);
                        h += c, Math.abs(e._normalizeBearing(h, 0)) < this._bearingSnap && (h = e._normalizeBearing(0, h)), e.rotateTo(h, { duration: 1e3 * l, easing: inertiaEasing, noMoveStart: !0 }, { originalEvent: t }) } }, _fireEvent: function(t, e) {
                    return this._map.fire(t, { originalEvent: e }) }, _ignoreEvent: function(t) {
                    var e = this._map;
                    if (e.boxZoom && e.boxZoom.isActive()) return !0;
                    if (e.dragPan && e.dragPan.isActive()) return !0;
                    if (t.touches) return t.touches.length > 1;
                    var i = t.ctrlKey ? 1 : 2,
                        n = t.ctrlKey ? 0 : 2;
                    return "mousemove" === t.type ? t.buttons & 0 === i : t.button !== n }, _drainInertiaBuffer: function() {
                    for (var t = this._inertia, e = Date.now(), i = 160; t.length > 0 && e - t[0][0] > i;) t.shift() } };
        }, { "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107 }],
        96: [function(require, module, exports) {
            "use strict";

            function KeyboardHandler(e) { this._map = e, this._el = e.getCanvasContainer(), this._onKeyDown = this._onKeyDown.bind(this) }

            function easeOut(e) {
                return e * (2 - e) }
            module.exports = KeyboardHandler;
            var panStep = 100,
                bearingStep = 15,
                pitchStep = 10;
            KeyboardHandler.prototype = { _enabled: !1, isEnabled: function() {
                    return this._enabled }, enable: function() { this.isEnabled() || (this._el.addEventListener("keydown", this._onKeyDown, !1), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("keydown", this._onKeyDown), this._enabled = !1) }, _onKeyDown: function(e) {
                    if (!(e.altKey || e.ctrlKey || e.metaKey)) {
                        var t = 0,
                            n = 0,
                            a = 0,
                            i = 0,
                            s = 0;
                        switch (e.keyCode) {
                            case 61:
                            case 107:
                            case 171:
                            case 187:
                                t = 1;
                                break;
                            case 189:
                            case 109:
                            case 173:
                                t = -1;
                                break;
                            case 37:
                                e.shiftKey ? n = -1 : (e.preventDefault(), i = -1);
                                break;
                            case 39:
                                e.shiftKey ? n = 1 : (e.preventDefault(), i = 1);
                                break;
                            case 38:
                                e.shiftKey ? a = 1 : (e.preventDefault(), s = -1);
                                break;
                            case 40:
                                e.shiftKey ? a = -1 : (s = 1, e.preventDefault()) }
                        var r = this._map,
                            o = r.getZoom(),
                            h = { duration: 300, delayEndEvents: 500, easing: easeOut, zoom: t ? Math.round(o) + t * (e.shiftKey ? 2 : 1) : o, bearing: r.getBearing() + n * bearingStep, pitch: r.getPitch() + a * pitchStep, offset: [-i * panStep, -s * panStep], center: r.getCenter() };
                        r.easeTo(h, { originalEvent: e }) } } };
        }, {}],
        97: [function(require, module, exports) {
            "use strict";

            function ScrollZoomHandler(e) { this._map = e, this._el = e.getCanvasContainer(), util.bindHandlers(this) }
            var DOM = require("../../util/dom"),
                util = require("../../util/util"),
                browser = require("../../util/browser"),
                window = require("../../util/window");
            module.exports = ScrollZoomHandler;
            var ua = window.navigator.userAgent.toLowerCase(),
                firefox = ua.indexOf("firefox") !== -1,
                safari = ua.indexOf("safari") !== -1 && ua.indexOf("chrom") === -1;
            ScrollZoomHandler.prototype = { _enabled: !1, isEnabled: function() {
                    return this._enabled }, enable: function() { this.isEnabled() || (this._el.addEventListener("wheel", this._onWheel, !1), this._el.addEventListener("mousewheel", this._onWheel, !1), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("wheel", this._onWheel), this._el.removeEventListener("mousewheel", this._onWheel), this._enabled = !1) }, _onWheel: function(e) {
                    var t; "wheel" === e.type ? (t = e.deltaY, firefox && e.deltaMode === window.WheelEvent.DOM_DELTA_PIXEL && (t /= browser.devicePixelRatio), e.deltaMode === window.WheelEvent.DOM_DELTA_LINE && (t *= 40)) : "mousewheel" === e.type && (t = -e.wheelDeltaY, safari && (t /= 3));
                    var i = browser.now(),
                        o = i - (this._time || 0);
                    this._pos = DOM.mousePos(this._el, e), this._time = i, 0 !== t && t % 4.000244140625 === 0 ? this._type = "wheel" : 0 !== t && Math.abs(t) < 4 ? this._type = "trackpad" : o > 400 ? (this._type = null, this._lastValue = t, this._timeout = setTimeout(this._onTimeout, 40)) : this._type || (this._type = Math.abs(o * t) < 200 ? "trackpad" : "wheel", this._timeout && (clearTimeout(this._timeout), this._timeout = null, t += this._lastValue)), e.shiftKey && t && (t /= 4), this._type && this._zoom(-t, e), e.preventDefault() }, _onTimeout: function() { this._type = "wheel", this._zoom(-this._lastValue) }, _zoom: function(e, t) {
                    if (0 !== e) {
                        var i = this._map,
                            o = 2 / (1 + Math.exp(-Math.abs(e / 100)));
                        e < 0 && 0 !== o && (o = 1 / o);
                        var s = i.ease ? i.ease.to : i.transform.scale,
                            a = i.transform.scaleZoom(s * o);
                        i.zoomTo(a, { duration: "wheel" === this._type ? 200 : 0, around: i.unproject(this._pos), delayEndEvents: 200, smoothEasing: !0 }, { originalEvent: t }) } } };
        }, { "../../util/browser": 105, "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107 }],
        98: [function(require, module, exports) {
            "use strict";

            function TouchZoomRotateHandler(t) { this._map = t, this._el = t.getCanvasContainer(), util.bindHandlers(this) }
            var DOM = require("../../util/dom"),
                util = require("../../util/util"),
                window = require("../../util/window");
            module.exports = TouchZoomRotateHandler;
            var inertiaLinearity = .15,
                inertiaEasing = util.bezier(0, 0, inertiaLinearity, 1),
                inertiaDeceleration = 12,
                inertiaMaxSpeed = 2.5,
                significantScaleThreshold = .15,
                significantRotateThreshold = 4;
            TouchZoomRotateHandler.prototype = { _enabled: !1, isEnabled: function() {
                    return this._enabled }, enable: function() { this.isEnabled() || (this._el.addEventListener("touchstart", this._onStart, !1), this._enabled = !0) }, disable: function() { this.isEnabled() && (this._el.removeEventListener("touchstart", this._onStart), this._enabled = !1) }, disableRotation: function() { this._rotationDisabled = !0 }, enableRotation: function() { this._rotationDisabled = !1 }, _onStart: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            i = DOM.mousePos(this._el, t.touches[1]);
                        this._startVec = e.sub(i), this._startScale = this._map.transform.scale, this._startBearing = this._map.transform.bearing, this._gestureIntent = void 0, this._inertia = [], window.document.addEventListener("touchmove", this._onMove, !1), window.document.addEventListener("touchend", this._onEnd, !1) } }, _onMove: function(t) {
                    if (2 === t.touches.length) {
                        var e = DOM.mousePos(this._el, t.touches[0]),
                            i = DOM.mousePos(this._el, t.touches[1]),
                            n = e.add(i).div(2),
                            a = e.sub(i),
                            s = a.mag() / this._startVec.mag(),
                            r = this._rotationDisabled ? 0 : 180 * a.angleWith(this._startVec) / Math.PI,
                            o = this._map;
                        if (this._gestureIntent) {
                            var h = { duration: 0, around: o.unproject(n) }; "rotate" === this._gestureIntent && (h.bearing = this._startBearing + r), "zoom" !== this._gestureIntent && "rotate" !== this._gestureIntent || (h.zoom = o.transform.scaleZoom(this._startScale * s)), o.stop(), this._drainInertiaBuffer(), this._inertia.push([Date.now(), s, n]), o.easeTo(h, { originalEvent: t }) } else {
                            var u = Math.abs(1 - s) > significantScaleThreshold,
                                l = Math.abs(r) > significantRotateThreshold;
                            l ? this._gestureIntent = "rotate" : u && (this._gestureIntent = "zoom"), this._gestureIntent && (this._startVec = a, this._startScale = o.transform.scale, this._startBearing = o.transform.bearing) }
                        t.preventDefault() } }, _onEnd: function(t) { window.document.removeEventListener("touchmove", this._onMove), window.document.removeEventListener("touchend", this._onEnd), this._drainInertiaBuffer();
                    var e = this._inertia,
                        i = this._map;
                    if (e.length < 2) return void i.snapToNorth({}, { originalEvent: t });
                    var n = e[e.length - 1],
                        a = e[0],
                        s = i.transform.scaleZoom(this._startScale * n[1]),
                        r = i.transform.scaleZoom(this._startScale * a[1]),
                        o = s - r,
                        h = (n[0] - a[0]) / 1e3,
                        u = n[2];
                    if (0 === h || s === r) return void i.snapToNorth({}, { originalEvent: t });
                    var l = o * inertiaLinearity / h;
                    Math.abs(l) > inertiaMaxSpeed && (l = l > 0 ? inertiaMaxSpeed : -inertiaMaxSpeed);
                    var d = 1e3 * Math.abs(l / (inertiaDeceleration * inertiaLinearity)),
                        _ = s + l * d / 2e3;
                    _ < 0 && (_ = 0), i.easeTo({ zoom: _, duration: d, easing: inertiaEasing, around: i.unproject(u) }, { originalEvent: t }) }, _drainInertiaBuffer: function() {
                    for (var t = this._inertia, e = Date.now(), i = 160; t.length > 2 && e - t[0][0] > i;) t.shift() } };
        }, { "../../util/dom": 112, "../../util/util": 122, "../../util/window": 107 }],
        99: [function(require, module, exports) {
            "use strict";

            function Hash() { util.bindAll(["_onHashChange", "_updateHash"], this) }
            module.exports = Hash;
            var util = require("../util/util"),
                window = require("../util/window");
            Hash.prototype = { addTo: function(t) {
                    return this._map = t, window.addEventListener("hashchange", this._onHashChange, !1), this._map.on("moveend", this._updateHash), this }, remove: function() {
                    return window.removeEventListener("hashchange", this._onHashChange, !1), this._map.off("moveend", this._updateHash), delete this._map, this }, _onHashChange: function() {
                    var t = window.location.hash.replace("#", "").split("/");
                    return t.length >= 3 && (this._map.jumpTo({ center: [+t[2], +t[1]], zoom: +t[0], bearing: +(t[3] || 0), pitch: +(t[4] || 0) }), !0) }, _updateHash: function() {
                    var t = this._map.getCenter(),
                        e = this._map.getZoom(),
                        a = this._map.getBearing(),
                        h = this._map.getPitch(),
                        i = Math.max(0, Math.ceil(Math.log(e) / Math.LN2)),
                        n = "#" + Math.round(100 * e) / 100 + "/" + t.lat.toFixed(i) + "/" + t.lng.toFixed(i);
                    (a || h) && (n += "/" + Math.round(10 * a) / 10), h && (n += "/" + Math.round(h)), window.history.replaceState("", "", n) } };
        }, { "../util/util": 122, "../util/window": 107 }],
        100: [function(require, module, exports) {
            "use strict";

            function removeNode(t) { t.parentNode && t.parentNode.removeChild(t) }
            var util = require("../util/util"),
                browser = require("../util/browser"),
                window = require("../util/window"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                Style = require("../style/style"),
                AnimationLoop = require("../style/animation_loop"),
                Painter = require("../render/painter"),
                Transform = require("../geo/transform"),
                Hash = require("./hash"),
                bindHandlers = require("./bind_handlers"),
                Camera = require("./camera"),
                LngLat = require("../geo/lng_lat"),
                LngLatBounds = require("../geo/lng_lat_bounds"),
                Point = require("point-geometry"),
                AttributionControl = require("./control/attribution_control"),
                isSupported = require("mapbox-gl-supported"),
                defaultMinZoom = 0,
                defaultMaxZoom = 20,
                defaultOptions = { center: [0, 0], zoom: 0, bearing: 0, pitch: 0, minZoom: defaultMinZoom, maxZoom: defaultMaxZoom, interactive: !0, scrollZoom: !0, boxZoom: !0, dragRotate: !0, dragPan: !0, keyboard: !0, doubleClickZoom: !0, touchZoomRotate: !0, bearingSnap: 7, hash: !1, attributionControl: !0, failIfMajorPerformanceCaveat: !1, preserveDrawingBuffer: !1, trackResize: !0 },
                Map = module.exports = function(t) { t = util.extend({}, defaultOptions, t), this._interactive = t.interactive, this._failIfMajorPerformanceCaveat = t.failIfMajorPerformanceCaveat, this._preserveDrawingBuffer = t.preserveDrawingBuffer, this._trackResize = t.trackResize, this._bearingSnap = t.bearingSnap, "string" == typeof t.container ? this._container = window.document.getElementById(t.container) : this._container = t.container, this.animationLoop = new AnimationLoop, this.transform = new Transform(t.minZoom, t.maxZoom), t.maxBounds && this.setMaxBounds(t.maxBounds), util.bindAll(["_onWindowOnline", "_onWindowResize", "_contextLost", "_contextRestored", "_update", "_render"], this), this._setupContainer(), this._setupPainter(), this.on("move", this._update.bind(this, !1)), this.on("zoom", this._update.bind(this, !0)), this.on("moveend", function() { this.animationLoop.set(300), this._rerender() }.bind(this)), "undefined" != typeof window && (window.addEventListener("online", this._onWindowOnline, !1), window.addEventListener("resize", this._onWindowResize, !1)), bindHandlers(this, t), this._hash = t.hash && (new Hash).addTo(this), this._hash && this._hash._onHashChange() || this.jumpTo({ center: t.center, zoom: t.zoom, bearing: t.bearing, pitch: t.pitch }), this._classes = [], this.resize(), t.classes && this.setClasses(t.classes), t.style && this.setStyle(t.style), t.attributionControl && this.addControl(new AttributionControl(t.attributionControl)), this.on("style.load", function() { this.transform.unmodified && this.jumpTo(this.style.stylesheet), this.style.update(this._classes, { transition: !1 }) }), this.on("data", function(t) { "style" === t.dataType ? this._update(!0) : this._update() }) };
            util.extend(Map.prototype, Evented), util.extend(Map.prototype, Camera.prototype), util.extend(Map.prototype, { addControl: function(t) {
                    return t.addTo(this), this }, addClass: function(t, e) {
                    return this._classes.indexOf(t) >= 0 || "" === t ? this : (this._classes.push(t), this._classOptions = e, this.style && this.style.updateClasses(), this._update(!0)) }, removeClass: function(t, e) {
                    var i = this._classes.indexOf(t);
                    return i < 0 || "" === t ? this : (this._classes.splice(i, 1), this._classOptions = e, this.style && this.style.updateClasses(), this._update(!0)) }, setClasses: function(t, e) {
                    for (var i = {}, s = 0; s < t.length; s++) "" !== t[s] && (i[t[s]] = !0);
                    return this._classes = Object.keys(i), this._classOptions = e, this.style && this.style.updateClasses(), this._update(!0) }, hasClass: function(t) {
                    return this._classes.indexOf(t) >= 0 }, getClasses: function() {
                    return this._classes }, resize: function() {
                    var t = this._containerDimensions(),
                        e = t[0],
                        i = t[1];
                    return this._resizeCanvas(e, i), this.transform.resize(e, i), this.painter.resize(e, i), this.fire("movestart").fire("move").fire("resize").fire("moveend") }, getBounds: function() {
                    var t = new LngLatBounds(this.transform.pointLocation(new Point(0, this.transform.height)), this.transform.pointLocation(new Point(this.transform.width, 0)));
                    return (this.transform.angle || this.transform.pitch) && (t.extend(this.transform.pointLocation(new Point(this.transform.size.x, 0))), t.extend(this.transform.pointLocation(new Point(0, this.transform.size.y)))), t }, setMaxBounds: function(t) {
                    if (t) {
                        var e = LngLatBounds.convert(t);
                        this.transform.lngRange = [e.getWest(), e.getEast()], this.transform.latRange = [e.getSouth(), e.getNorth()], this.transform._constrain(), this._update() } else null !== t && void 0 !== t || (this.transform.lngRange = [], this.transform.latRange = [], this._update());
                    return this }, setMinZoom: function(t) {
                    if (t = null === t || void 0 === t ? defaultMinZoom : t, t >= defaultMinZoom && t <= this.transform.maxZoom) return this.transform.minZoom = t, this._update(), this.getZoom() < t && this.setZoom(t), this;
                    throw new Error("minZoom must be between " + defaultMinZoom + " and the current maxZoom, inclusive") }, setMaxZoom: function(t) {
                    if (t = null === t || void 0 === t ? defaultMaxZoom : t, t >= this.transform.minZoom && t <= defaultMaxZoom) return this.transform.maxZoom = t, this._update(), this.getZoom() > t && this.setZoom(t), this;
                    throw new Error("maxZoom must be between the current minZoom and " + defaultMaxZoom + ", inclusive") }, project: function(t) {
                    return this.transform.locationPoint(LngLat.convert(t)) }, unproject: function(t) {
                    return this.transform.pointLocation(Point.convert(t)) }, queryRenderedFeatures: function() {
                    function t(t) {
                        return t instanceof Point || Array.isArray(t) }
                    var e, i = {};
                    return 2 === arguments.length ? (e = arguments[0], i = arguments[1]) : 1 === arguments.length && t(arguments[0]) ? e = arguments[0] : 1 === arguments.length && (i = arguments[0]), this.style.queryRenderedFeatures(this._makeQueryGeometry(e), i, this.transform.zoom, this.transform.angle) }, _makeQueryGeometry: function(t) { void 0 === t && (t = [Point.convert([0, 0]), Point.convert([this.transform.width, this.transform.height])]);
                    var e, i = t instanceof Point || "number" == typeof t[0];
                    if (i) {
                        var s = Point.convert(t);
                        e = [s] } else {
                        var n = [Point.convert(t[0]), Point.convert(t[1])];
                        e = [n[0], new Point(n[1].x, n[0].y), n[1], new Point(n[0].x, n[1].y), n[0]] }
                    return e = e.map(function(t) {
                        return this.transform.pointCoordinate(t) }.bind(this)) }, querySourceFeatures: function(t, e) {
                    return this.style.querySourceFeatures(t, e) }, setStyle: function(t) {
                    return this.style && (this.style.setEventedParent(null), this.style._remove(), this.off("rotate", this.style._redoPlacement), this.off("pitch", this.style._redoPlacement)), t ? (t instanceof Style ? this.style = t : this.style = new Style(t, this), this.style.setEventedParent(this, { style: this.style }), this.on("rotate", this.style._redoPlacement), this.on("pitch", this.style._redoPlacement), this) : (this.style = null, this) }, getStyle: function() {
                    if (this.style) return this.style.serialize() }, addSource: function(t, e) {
                    return this.style.addSource(t, e), this._update(!0), this }, addSourceType: function(t, e, i) {
                    return this.style.addSourceType(t, e, i) }, removeSource: function(t) {
                    return this.style.removeSource(t), this._update(!0), this }, getSource: function(t) {
                    return this.style.getSource(t) }, addLayer: function(t, e) {
                    return this.style.addLayer(t, e), this._update(!0), this }, removeLayer: function(t) {
                    return this.style.removeLayer(t), this._update(!0), this }, getLayer: function(t) {
                    return this.style.getLayer(t) }, setFilter: function(t, e) {
                    return this.style.setFilter(t, e), this._update(!0), this }, setLayerZoomRange: function(t, e, i) {
                    return this.style.setLayerZoomRange(t, e, i), this._update(!0), this }, getFilter: function(t) {
                    return this.style.getFilter(t) }, setPaintProperty: function(t, e, i, s) {
                    return this.style.setPaintProperty(t, e, i, s), this._update(!0), this }, getPaintProperty: function(t, e, i) {
                    return this.style.getPaintProperty(t, e, i) }, setLayoutProperty: function(t, e, i) {
                    return this.style.setLayoutProperty(t, e, i), this._update(!0), this }, getLayoutProperty: function(t, e) {
                    return this.style.getLayoutProperty(t, e) }, setLight: function(t) {
                    return this.style.setLight(t), this._update(!0), this }, getLight: function() {
                    return this.style.getLight() }, getContainer: function() {
                    return this._container }, getCanvasContainer: function() {
                    return this._canvasContainer }, getCanvas: function() {
                    return this._canvas }, _containerDimensions: function() {
                    var t = 0,
                        e = 0;
                    return this._container && (t = this._container.offsetWidth || 400, e = this._container.offsetHeight || 300), [t, e] }, _setupContainer: function() {
                    var t = this._container;
                    t.classList.add("mapboxgl-map");
                    var e = this._canvasContainer = DOM.create("div", "mapboxgl-canvas-container", t);
                    this._interactive && e.classList.add("mapboxgl-interactive"), this._canvas = DOM.create("canvas", "mapboxgl-canvas", e), this._canvas.style.position = "absolute", this._canvas.addEventListener("webglcontextlost", this._contextLost, !1), this._canvas.addEventListener("webglcontextrestored", this._contextRestored, !1), this._canvas.setAttribute("tabindex", 0);
                    var i = this._containerDimensions();
                    this._resizeCanvas(i[0], i[1]);
                    var s = this._controlContainer = DOM.create("div", "mapboxgl-control-container", t),
                        n = this._controlCorners = {};
                    ["top-left", "top-right", "bottom-left", "bottom-right"].forEach(function(t) { n[t] = DOM.create("div", "mapboxgl-ctrl-" + t, s) }) }, _resizeCanvas: function(t, e) {
                    var i = window.devicePixelRatio || 1;
                    this._canvas.width = i * t, this._canvas.height = i * e, this._canvas.style.width = t + "px", this._canvas.style.height = e + "px" }, _setupPainter: function() {
                    var t = util.extend({ failIfMajorPerformanceCaveat: this._failIfMajorPerformanceCaveat, preserveDrawingBuffer: this._preserveDrawingBuffer }, isSupported.webGLContextAttributes),
                        e = this._canvas.getContext("webgl", t) || this._canvas.getContext("experimental-webgl", t);
                    return e ? void(this.painter = new Painter(e, this.transform)) : void this.fire("error", { error: new Error("Failed to initialize WebGL") }) }, _contextLost: function(t) { t.preventDefault(), this._frameId && browser.cancelFrame(this._frameId), this.fire("webglcontextlost", { originalEvent: t }) }, _contextRestored: function(t) { this._setupPainter(), this.resize(), this._update(), this.fire("webglcontextrestored", { originalEvent: t }) }, loaded: function() {
                    return !this._styleDirty && !this._sourcesDirty && !(!this.style || !this.style.loaded()) }, _update: function(t) {
                    return this.style ? (this._styleDirty = this._styleDirty || t, this._sourcesDirty = !0, this._rerender(), this) : this }, _render: function() {
                    return this.style && this._styleDirty && (this._styleDirty = !1, this.style.update(this._classes, this._classOptions), this._classOptions = null, this.style._recalculate(this.transform.zoom)), this.style && this._sourcesDirty && (this._sourcesDirty = !1, this.style._updateSources(this.transform)), this.painter.render(this.style, { debug: this.showTileBoundaries, showOverdrawInspector: this._showOverdrawInspector, vertices: this.vertices, rotating: this.rotating, zooming: this.zooming }), this.fire("render"), this.loaded() && !this._loaded && (this._loaded = !0, this.fire("load")), this._frameId = null, this.animationLoop.stopped() || (this._styleDirty = !0), (this._sourcesDirty || this._repaint || this._styleDirty) && this._rerender(), this }, remove: function() { this._hash && this._hash.remove(), browser.cancelFrame(this._frameId), this.setStyle(null), "undefined" != typeof window && window.removeEventListener("resize", this._onWindowResize, !1);
                    var t = this.painter.gl.getExtension("WEBGL_lose_context");
                    t && t.loseContext(), removeNode(this._canvasContainer), removeNode(this._controlContainer), this._container.classList.remove("mapboxgl-map"), this.fire("remove") }, _rerender: function() { this.style && !this._frameId && (this._frameId = browser.frame(this._render)) }, _onWindowOnline: function() { this._update() }, _onWindowResize: function() { this._trackResize && this.stop().resize()._update() } }), util.extendAll(Map.prototype, { _showTileBoundaries: !1, get showTileBoundaries() {
                    return this._showTileBoundaries }, set showTileBoundaries(t) { this._showTileBoundaries !== t && (this._showTileBoundaries = t, this._update()) }, _showCollisionBoxes: !1, get showCollisionBoxes() {
                    return this._showCollisionBoxes }, set showCollisionBoxes(t) { this._showCollisionBoxes !== t && (this._showCollisionBoxes = t, this.style._redoPlacement()) }, _showOverdrawInspector: !1, get showOverdrawInspector() {
                    return this._showOverdrawInspector }, set showOverdrawInspector(t) { this._showOverdrawInspector !== t && (this._showOverdrawInspector = t, this._update()) }, _repaint: !1, get repaint() {
                    return this._repaint }, set repaint(t) { this._repaint = t, this._update() }, _vertices: !1, get vertices() {
                    return this._vertices }, set vertices(t) { this._vertices = t, this._update() } });
        }, { "../geo/lng_lat": 13, "../geo/lng_lat_bounds": 14, "../geo/transform": 15, "../render/painter": 31, "../style/animation_loop": 52, "../style/style": 56, "../util/browser": 105, "../util/dom": 112, "../util/evented": 113, "../util/util": 122, "../util/window": 107, "./bind_handlers": 85, "./camera": 86, "./control/attribution_control": 87, "./hash": 99, "mapbox-gl-supported": 188, "point-geometry": 192 }],
        101: [function(require, module, exports) {
            "use strict";

            function Marker(t, e) { this._offset = Point.convert(e && e.offset || [0, 0]), this._update = this._update.bind(this), this._onMapClick = this._onMapClick.bind(this), t || (t = DOM.create("div")), t.classList.add("mapboxgl-marker"), this._element = t, this._popup = null }
            module.exports = Marker;
            var DOM = require("../util/dom"),
                util = require("../util/util"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                Popup = require("./popup");
            Marker.prototype = { addTo: function(t) {
                    return this.remove(), this._map = t, t.getCanvasContainer().appendChild(this._element), t.on("move", this._update), t.on("moveend", this._update), this._update(), this._map.on("click", this._onMapClick), this }, remove: function() {
                    return this._map && (this._map.off("click", this._onMapClick), this._map.off("move", this._update), this._map.off("moveend", this._update), this._map = null), DOM.remove(this._element), this._popup && this._popup.remove(), this }, getLngLat: function() {
                    return this._lngLat }, setLngLat: function(t) {
                    return this._lngLat = LngLat.convert(t), this._popup && this._popup.setLngLat(this._lngLat), this._update(), this }, getElement: function() {
                    return this._element }, setPopup: function(t) {
                    return this._popup && (this._popup.remove(), this._popup = null), t && (this._popup = t, this._popup.setLngLat(this._lngLat)), this }, _onMapClick: function(t) {
                    var e = t.originalEvent.target,
                        i = this._element;
                    this._popup && (e === i || i.contains(e)) && this.togglePopup() }, getPopup: function() {
                    return this._popup }, togglePopup: function() {
                    var t = this._popup;
                    t && (t.isOpen() ? t.remove() : t.addTo(this._map)) }, _update: function(t) {
                    if (this._map) {
                        var e = this._map.project(this._lngLat)._add(this._offset);
                        t && "moveend" !== t.type || (e = e.round()), DOM.setTransform(this._element, "translate(" + e.x + "px," + e.y + "px)") } } };
        }, { "../geo/lng_lat": 13, "../util/dom": 112, "../util/util": 122, "./popup": 102, "point-geometry": 192 }],
        102: [function(require, module, exports) {
            "use strict";

            function Popup(t) { util.setOptions(this, t), util.bindAll(["_update", "_onClickClose"], this) }

            function normalizeOffset(t) {
                if (t) {
                    if ("number" == typeof t) {
                        var o = Math.round(Math.sqrt(.5 * Math.pow(t, 2)));
                        return { top: new Point(0, t), "top-left": new Point(o, o), "top-right": new Point(-o, o), bottom: new Point(0, -t), "bottom-left": new Point(o, -o), "bottom-right": new Point(-o, -o), left: new Point(t, 0), right: new Point(-t, 0) } }
                    if (isPointLike(t)) {
                        var n = Point.convert(t);
                        return { top: n, "top-left": n, "top-right": n, bottom: n, "bottom-left": n, "bottom-right": n, left: n, right: n } }
                    return { top: Point.convert(t.top), "top-left": Point.convert(t["top-left"]), "top-right": Point.convert(t["top-right"]), bottom: Point.convert(t.bottom), "bottom-left": Point.convert(t["bottom-left"]), "bottom-right": Point.convert(t["bottom-right"]), left: Point.convert(t.left), right: Point.convert(t.right) } }
                return normalizeOffset(new Point(0, 0)) }

            function isPointLike(t) {
                return t instanceof Point || Array.isArray(t) }
            module.exports = Popup;
            var util = require("../util/util"),
                Evented = require("../util/evented"),
                DOM = require("../util/dom"),
                LngLat = require("../geo/lng_lat"),
                Point = require("point-geometry"),
                window = require("../util/window");
            Popup.prototype = util.inherit(Evented, { options: { closeButton: !0, closeOnClick: !0 }, addTo: function(t) {
                    return this._map = t, this._map.on("move", this._update), this.options.closeOnClick && this._map.on("click", this._onClickClose), this._update(), this }, isOpen: function() {
                    return !!this._map }, remove: function() {
                    return this._content && this._content.parentNode && this._content.parentNode.removeChild(this._content), this._container && (this._container.parentNode.removeChild(this._container), delete this._container), this._map && (this._map.off("move", this._update), this._map.off("click", this._onClickClose), delete this._map), this.fire("close"), this }, getLngLat: function() {
                    return this._lngLat }, setLngLat: function(t) {
                    return this._lngLat = LngLat.convert(t), this._update(), this }, setText: function(t) {
                    return this.setDOMContent(window.document.createTextNode(t)) }, setHTML: function(t) {
                    var o, n = window.document.createDocumentFragment(),
                        e = window.document.createElement("body");
                    for (e.innerHTML = t;;) {
                        if (o = e.firstChild, !o) break;
                        n.appendChild(o) }
                    return this.setDOMContent(n) }, setDOMContent: function(t) {
                    return this._createContent(), this._content.appendChild(t), this._update(), this }, _createContent: function() { this._content && this._content.parentNode && this._content.parentNode.removeChild(this._content), this._content = DOM.create("div", "mapboxgl-popup-content", this._container), this.options.closeButton && (this._closeButton = DOM.create("button", "mapboxgl-popup-close-button", this._content), this._closeButton.type = "button", this._closeButton.innerHTML = "&#215;", this._closeButton.addEventListener("click", this._onClickClose)) }, _update: function() {
                    if (this._map && this._lngLat && this._content) { this._container || (this._container = DOM.create("div", "mapboxgl-popup", this._map.getContainer()), this._tip = DOM.create("div", "mapboxgl-popup-tip", this._container), this._container.appendChild(this._content));
                        var t = this.options.anchor,
                            o = normalizeOffset(this.options.offset),
                            n = this._map.project(this._lngLat).round();
                        if (!t) {
                            var e = this._container.offsetWidth,
                                i = this._container.offsetHeight;
                            t = n.y + o.bottom.y < i ? ["top"] : n.y > this._map.transform.height - i ? ["bottom"] : [], n.x < e / 2 ? t.push("left") : n.x > this._map.transform.width - e / 2 && t.push("right"), t = 0 === t.length ? "bottom" : t.join("-") }
                        var r = n.add(o[t]),
                            s = { top: "translate(-50%,0)", "top-left": "translate(0,0)", "top-right": "translate(-100%,0)", bottom: "translate(-50%,-100%)", "bottom-left": "translate(0,-100%)", "bottom-right": "translate(-100%,-100%)", left: "translate(0,-50%)", right: "translate(-100%,-50%)" },
                            a = this._container.classList;
                        for (var h in s) a.remove("mapboxgl-popup-anchor-" + h);
                        a.add("mapboxgl-popup-anchor-" + t), DOM.setTransform(this._container, s[t] + " translate(" + r.x + "px," + r.y + "px)") } }, _onClickClose: function() { this.remove() } });
        }, { "../geo/lng_lat": 13, "../util/dom": 112, "../util/evented": 113, "../util/util": 122, "../util/window": 107, "point-geometry": 192 }],
        103: [function(require, module, exports) {
            "use strict";

            function Actor(t, e, i) { this.target = t, this.parent = e, this.mapId = i, this.callbacks = {}, this.callbackID = 0, this.receive = this.receive.bind(this), this.target.addEventListener("message", this.receive, !1) }
            module.exports = Actor, Actor.prototype.send = function(t, e, i, s, a) {
                var r = i ? this.mapId + ":" + this.callbackID++ : null;
                i && (this.callbacks[r] = i), this.target.postMessage({ targetMapId: a, sourceMapId: this.mapId, type: t, id: String(r), data: e }, s) }, Actor.prototype.receive = function(t) {
                function e(t, e, i) { this.target.postMessage({ sourceMapId: this.mapId, type: "<response>", id: String(a), error: t ? String(t) : null, data: e }, i) }
                var i, s = t.data,
                    a = s.id;
                if (!s.targetMapId || this.mapId === s.targetMapId)
                    if ("<response>" === s.type) i = this.callbacks[s.id], delete this.callbacks[s.id], i && i(s.error || null, s.data);
                    else if ("undefined" != typeof s.id && this.parent[s.type]) this.parent[s.type](s.sourceMapId, s.data, e.bind(this));
                else if ("undefined" != typeof s.id && this.parent.getWorkerSource) {
                    var r = s.type.split("."),
                        p = this.parent.getWorkerSource(s.sourceMapId, r[0]);
                    p[r[1]](s.data, e.bind(this)) } else this.parent[s.type](s.data) }, Actor.prototype.remove = function() { this.target.removeEventListener("message", this.receive, !1) };
        }, {}],
        104: [function(require, module, exports) {
            "use strict";

            function sameOrigin(e) {
                var t = window.document.createElement("a");
                return t.href = e, t.protocol === window.document.location.protocol && t.host === window.document.location.host }
            var window = require("./window");
            exports.getJSON = function(e, t) {
                var n = new window.XMLHttpRequest;
                return n.open("GET", e, !0), n.setRequestHeader("Accept", "application/json"), n.onerror = function(e) { t(e) }, n.onload = function() {
                    if (n.status >= 200 && n.status < 300 && n.response) {
                        var e;
                        try { e = JSON.parse(n.response) } catch (e) {
                            return t(e) }
                        t(null, e) } else t(new Error(n.statusText)) }, n.send(), n }, exports.getArrayBuffer = function(e, t) {
                var n = new window.XMLHttpRequest;
                return n.open("GET", e, !0), n.responseType = "arraybuffer", n.onerror = function(e) { t(e) }, n.onload = function() { n.status >= 200 && n.status < 300 && n.response ? t(null, n.response) : t(new Error(n.statusText)) }, n.send(), n }, exports.getImage = function(e, t) {
                return exports.getArrayBuffer(e, function(e, n) {
                    if (e) return t(e);
                    var r = new window.Image;
                    r.onload = function() { t(null, r), (window.URL || window.webkitURL).revokeObjectURL(r.src) };
                    var o = new window.Blob([new Uint8Array(n)], { type: "image/png" });
                    return r.src = (window.URL || window.webkitURL).createObjectURL(o), r.getData = function() {
                        var e = window.document.createElement("canvas"),
                            t = e.getContext("2d");
                        return e.width = r.width, e.height = r.height, t.drawImage(r, 0, 0), t.getImageData(0, 0, r.width, r.height).data }, r }) }, exports.getVideo = function(e, t) {
                var n = window.document.createElement("video");
                n.onloadstart = function() { t(null, n) };
                for (var r = 0; r < e.length; r++) {
                    var o = window.document.createElement("source");
                    sameOrigin(e[r]) || (n.crossOrigin = "Anonymous"), o.src = e[r], n.appendChild(o) }
                return n.getData = function() {
                    return n }, n };
        }, { "./window": 107 }],
        105: [function(require, module, exports) {
            "use strict";
            var window = require("./window");
            module.exports.now = function() {
                return window.performance && window.performance.now ? window.performance.now.bind(window.performance) : Date.now.bind(Date) }();
            var frame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            exports.frame = function(e) {
                return frame(e) };
            var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            exports.cancelFrame = function(e) { cancel(e) }, exports.timed = function(e, n, o) {
                function r(a) { t || (a = module.exports.now(), a >= i + n ? e.call(o, 1) : (e.call(o, (a - i) / n), exports.frame(r))) }
                if (!n) return e.call(o, 1), null;
                var t = !1,
                    i = module.exports.now();
                return exports.frame(r),
                    function() { t = !0 } }, exports.supported = require("mapbox-gl-supported"), exports.hardwareConcurrency = window.navigator.hardwareConcurrency || 4, Object.defineProperty(exports, "devicePixelRatio", { get: function() {
                    return window.devicePixelRatio } }), exports.supportsWebp = !1;
            var webpImgTest = window.document.createElement("img");
            webpImgTest.onload = function() { exports.supportsWebp = !0 }, webpImgTest.src = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=", exports.supportsGeolocation = !!window.navigator.geolocation;
        }, { "./window": 107, "mapbox-gl-supported": 188 }],
        106: [function(require, module, exports) {
            "use strict";
            var WebWorkify = require("webworkify"),
                window = require("../window"),
                workerURL = window.URL.createObjectURL(new WebWorkify(require("../../source/worker"), { bare: !0 }));
            module.exports = function() {
                return new window.Worker(workerURL) };
        }, { "../../source/worker": 50, "../window": 107, "webworkify": 209 }],
        107: [function(require, module, exports) {
            "use strict";
            module.exports = self;
        }, {}],
        108: [function(require, module, exports) {
            "use strict";

            function compareAreas(e, r) {
                return r.area - e.area }
            var quickselect = require("quickselect"),
                calculateSignedArea = require("./util").calculateSignedArea;
            module.exports = function(e, r) {
                var a = e.length;
                if (a <= 1) return [e];
                for (var t, u, c = [], i = 0; i < a; i++) {
                    var l = calculateSignedArea(e[i]);
                    0 !== l && (e[i].area = Math.abs(l), void 0 === u && (u = l < 0), u === l < 0 ? (t && c.push(t), t = [e[i]]) : t.push(e[i])) }
                if (t && c.push(t), r > 1)
                    for (var n = 0; n < c.length; n++) c[n].length <= r || (quickselect(c[n], r, 1, c[n].length - 1, compareAreas), c[n] = c[n].slice(0, r));
                return c };
        }, { "./util": 122, "quickselect": 193 }],
        109: [function(require, module, exports) {
            "use strict";
            module.exports = { API_URL: "https://api.mapbox.com", REQUIRE_ACCESS_TOKEN: !0 };
        }, {}],
        110: [function(require, module, exports) {
            "use strict";

            function DictionaryCoder(r) { this._stringToNumber = {}, this._numberToString = [];
                for (var t = 0; t < r.length; t++) {
                    var o = r[t];
                    this._stringToNumber[o] = t, this._numberToString[t] = o } }
            module.exports = DictionaryCoder, DictionaryCoder.prototype.encode = function(r) {
                return this._stringToNumber[r] }, DictionaryCoder.prototype.decode = function(r) {
                return this._numberToString[r] };
        }, {}],
        111: [function(require, module, exports) {
            "use strict";

            function Dispatcher(t, r) { this.workerPool = t, this.actors = [], this.currentActor = 0, this.id = util.uniqueId();
                for (var i = this.workerPool.acquire(this.id), o = 0; o < i.length; o++) {
                    var s = i[o],
                        e = new Actor(s, r, this.id);
                    e.name = "Worker " + o, this.actors.push(e) } }
            var util = require("./util"),
                Actor = require("./actor");
            module.exports = Dispatcher, Dispatcher.prototype = { broadcast: function(t, r, i) { i = i || function() {}, util.asyncAll(this.actors, function(i, o) { i.send(t, r, o) }, i) }, send: function(t, r, i, o, s) {
                    return ("number" != typeof o || isNaN(o)) && (o = this.currentActor = (this.currentActor + 1) % this.actors.length), this.actors[o].send(t, r, i, s), o }, remove: function() { this.actors.forEach(function(t) { t.remove() }), this.actors = [], this.workerPool.release(this.id) } };
        }, { "./actor": 103, "./util": 122 }],
        112: [function(require, module, exports) {
            "use strict";

            function testProp(e) {
                for (var t = 0; t < e.length; t++)
                    if (e[t] in docStyle) return e[t];
                return e[0] }

            function suppressClick(e) { e.preventDefault(), e.stopPropagation(), window.removeEventListener("click", suppressClick, !0) }
            var Point = require("point-geometry"),
                window = require("./window");
            exports.create = function(e, t, o) {
                var n = window.document.createElement(e);
                return t && (n.className = t), o && o.appendChild(n), n };
            var docStyle = window.document.documentElement.style,
                selectProp = testProp(["userSelect", "MozUserSelect", "WebkitUserSelect", "msUserSelect"]),
                userSelect;
            exports.disableDrag = function() { selectProp && (userSelect = docStyle[selectProp], docStyle[selectProp] = "none") }, exports.enableDrag = function() { selectProp && (docStyle[selectProp] = userSelect) };
            var transformProp = testProp(["transform", "WebkitTransform"]);
            exports.setTransform = function(e, t) { e.style[transformProp] = t }, exports.suppressClick = function() { window.addEventListener("click", suppressClick, !0), window.setTimeout(function() { window.removeEventListener("click", suppressClick, !0) }, 0) }, exports.mousePos = function(e, t) {
                var o = e.getBoundingClientRect();
                return t = t.touches ? t.touches[0] : t, new Point(t.clientX - o.left - e.clientLeft, t.clientY - o.top - e.clientTop) }, exports.touchPos = function(e, t) {
                for (var o = e.getBoundingClientRect(), n = [], r = "touchend" === t.type ? t.changedTouches : t.touches, s = 0; s < r.length; s++) n.push(new Point(r[s].clientX - o.left - e.clientLeft, r[s].clientY - o.top - e.clientTop));
                return n }, exports.remove = function(e) { e.parentNode && e.parentNode.removeChild(e) };
        }, { "./window": 107, "point-geometry": 192 }],
        113: [function(require, module, exports) {
            "use strict";
            var util = require("./util"),
                Evented = { on: function(e, t) {
                        return this._listeners = this._listeners || {}, this._listeners[e] = this._listeners[e] || [], this._listeners[e].push(t), this }, off: function(e, t) {
                        if (this._listeners && this._listeners[e]) {
                            var s = this._listeners[e].indexOf(t);
                            s !== -1 && this._listeners[e].splice(s, 1) }
                        return this }, once: function(e, t) {
                        var s = function(i) { this.off(e, s), t.call(this, i) }.bind(this);
                        return this.on(e, s), this }, fire: function(e, t) {
                        if (this.listens(e)) { t = util.extend({}, t, { type: e, target: this });
                            for (var s = this._listeners && this._listeners[e] ? this._listeners[e].slice() : [], i = 0; i < s.length; i++) s[i].call(this, t);
                            this._eventedParent && this._eventedParent.fire(e, util.extend({}, t, this._eventedParentData)) } else util.endsWith(e, "error") && console.error(t && t.error || t || "Empty error event");
                        return this }, listens: function(e) {
                        return this._listeners && this._listeners[e] || this._eventedParent && this._eventedParent.listens(e) }, setEventedParent: function(e, t) {
                        return this._eventedParent = e, this._eventedParentData = t, this } };
            module.exports = Evented;
        }, { "./util": 122 }],
        114: [function(require, module, exports) {
            "use strict";

            function compareMax(e, t) {
                return t.max - e.max }

            function Cell(e, t, n, r) { this.p = new Point(e, t), this.h = n, this.d = pointToPolygonDist(this.p, r), this.max = this.d + this.h * Math.SQRT2 }

            function pointToPolygonDist(e, t) {
                for (var n = !1, r = 1 / 0, o = 0; o < t.length; o++)
                    for (var l = t[o], i = 0, s = l.length, u = s - 1; i < s; u = i++) {
                        var a = l[i],
                            h = l[u];
                        a.y > e.y != h.y > e.y && e.x < (h.x - a.x) * (e.y - a.y) / (h.y - a.y) + a.x && (n = !n), r = Math.min(r, distToSegmentSquared(e, a, h)) }
                return (n ? 1 : -1) * Math.sqrt(r) }

            function getCentroidCell(e) {
                for (var t = 0, n = 0, r = 0, o = e[0], l = 0, i = o.length, s = i - 1; l < i; s = l++) {
                    var u = o[l],
                        a = o[s],
                        h = u.x * a.y - a.x * u.y;
                    n += (u.x + a.x) * h, r += (u.y + a.y) * h, t += 3 * h }
                return new Cell(n / t, r / t, 0, e) }
            var Queue = require("tinyqueue"),
                Point = require("point-geometry"),
                distToSegmentSquared = require("./intersection_tests").distToSegmentSquared;
            module.exports = function(e, t, n) { t = t || 1;
                for (var r, o, l, i, s = e[0], u = 0; u < s.length; u++) {
                    var a = s[u];
                    (!u || a.x < r) && (r = a.x), (!u || a.y < o) && (o = a.y), (!u || a.x > l) && (l = a.x), (!u || a.y > i) && (i = a.y) }
                for (var h = l - r, p = i - o, y = Math.min(h, p), x = y / 2, d = new Queue(null, compareMax), g = r; g < l; g += y)
                    for (var f = o; f < i; f += y) d.push(new Cell(g + x, f + x, x, e));
                for (var m = getCentroidCell(e), c = d.length; d.length;) {
                    var v = d.pop();
                    v.d > m.d && (m = v, n && console.log("found best %d after %d probes", Math.round(1e4 * v.d) / 1e4, c)), v.max - m.d <= t || (x = v.h / 2, d.push(new Cell(v.p.x - x, v.p.y - x, x, e)), d.push(new Cell(v.p.x + x, v.p.y - x, x, e)), d.push(new Cell(v.p.x - x, v.p.y + x, x, e)), d.push(new Cell(v.p.x + x, v.p.y + x, x, e)), c += 4) }
                return n && (console.log("num probes: " + c), console.log("best distance: " + m.d)), m.p };
        }, { "./intersection_tests": 117, "point-geometry": 192, "tinyqueue": 200 }],
        115: [function(require, module, exports) {
            "use strict";

            function Glyphs(a, e) { this.stacks = a.readFields(readFontstacks, [], e) }

            function readFontstacks(a, e, r) {
                if (1 === a) {
                    var t = r.readMessage(readFontstack, { glyphs: {} });
                    e.push(t) } }

            function readFontstack(a, e, r) {
                if (1 === a) e.name = r.readString();
                else if (2 === a) e.range = r.readString();
                else if (3 === a) {
                    var t = r.readMessage(readGlyph, {});
                    e.glyphs[t.id] = t } }

            function readGlyph(a, e, r) { 1 === a ? e.id = r.readVarint() : 2 === a ? e.bitmap = r.readBytes() : 3 === a ? e.width = r.readVarint() : 4 === a ? e.height = r.readVarint() : 5 === a ? e.left = r.readSVarint() : 6 === a ? e.top = r.readSVarint() : 7 === a && (e.advance = r.readVarint()) }
            module.exports = Glyphs;
        }, {}],
        116: [function(require, module, exports) {
            "use strict";

            function interpolate(t, e, n) {
                return t * (1 - n) + e * n }
            module.exports = interpolate, interpolate.number = interpolate, interpolate.vec2 = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n)] }, interpolate.color = function(t, e, n) {
                return [interpolate(t[0], e[0], n), interpolate(t[1], e[1], n), interpolate(t[2], e[2], n), interpolate(t[3], e[3], n)] }, interpolate.array = function(t, e, n) {
                return t.map(function(t, r) {
                    return interpolate(t, e[r], n) }) };
        }, {}],
        117: [function(require, module, exports) {
            "use strict";

            function multiPolygonIntersectsBufferedMultiPoint(e, n, t) {
                for (var r = 0; r < e.length; r++)
                    for (var i = e[r], o = 0; o < n.length; o++)
                        for (var u = n[o], l = 0; l < u.length; l++) {
                            var s = u[l];
                            if (polygonContainsPoint(i, s)) return !0;
                            if (pointIntersectsBufferedLine(s, i, t)) return !0 }
                return !1 }

            function multiPolygonIntersectsMultiPolygon(e, n) {
                if (1 === e.length && 1 === e[0].length) return multiPolygonContainsPoint(n, e[0][0]);
                for (var t = 0; t < n.length; t++)
                    for (var r = n[t], i = 0; i < r.length; i++)
                        if (multiPolygonContainsPoint(e, r[i])) return !0;
                for (var o = 0; o < e.length; o++) {
                    for (var u = e[o], l = 0; l < u.length; l++)
                        if (multiPolygonContainsPoint(n, u[l])) return !0;
                    for (var s = 0; s < n.length; s++)
                        if (lineIntersectsLine(u, n[s])) return !0 }
                return !1 }

            function multiPolygonIntersectsBufferedMultiLine(e, n, t) {
                for (var r = 0; r < n.length; r++)
                    for (var i = n[r], o = 0; o < e.length; o++) {
                        var u = e[o];
                        if (u.length >= 3)
                            for (var l = 0; l < i.length; l++)
                                if (polygonContainsPoint(u, i[l])) return !0;
                        if (lineIntersectsBufferedLine(u, i, t)) return !0 }
                return !1 }

            function lineIntersectsBufferedLine(e, n, t) {
                if (e.length > 1) {
                    if (lineIntersectsLine(e, n)) return !0;
                    for (var r = 0; r < n.length; r++)
                        if (pointIntersectsBufferedLine(n[r], e, t)) return !0 }
                for (var i = 0; i < e.length; i++)
                    if (pointIntersectsBufferedLine(e[i], n, t)) return !0;
                return !1 }

            function lineIntersectsLine(e, n) {
                for (var t = 0; t < e.length - 1; t++)
                    for (var r = e[t], i = e[t + 1], o = 0; o < n.length - 1; o++) {
                        var u = n[o],
                            l = n[o + 1];
                        if (lineSegmentIntersectsLineSegment(r, i, u, l)) return !0 }
                return !1 }

            function lineSegmentIntersectsLineSegment(e, n, t, r) {
                return isCounterClockwise(e, t, r) !== isCounterClockwise(n, t, r) && isCounterClockwise(e, n, t) !== isCounterClockwise(e, n, r) }

            function pointIntersectsBufferedLine(e, n, t) {
                var r = t * t;
                if (1 === n.length) return e.distSqr(n[0]) < r;
                for (var i = 1; i < n.length; i++) {
                    var o = n[i - 1],
                        u = n[i];
                    if (distToSegmentSquared(e, o, u) < r) return !0 }
                return !1 }

            function distToSegmentSquared(e, n, t) {
                var r = n.distSqr(t);
                if (0 === r) return e.distSqr(n);
                var i = ((e.x - n.x) * (t.x - n.x) + (e.y - n.y) * (t.y - n.y)) / r;
                return i < 0 ? e.distSqr(n) : i > 1 ? e.distSqr(t) : e.distSqr(t.sub(n)._mult(i)._add(n)) }

            function multiPolygonContainsPoint(e, n) {
                for (var t, r, i, o = !1, u = 0; u < e.length; u++) { t = e[u];
                    for (var l = 0, s = t.length - 1; l < t.length; s = l++) r = t[l], i = t[s], r.y > n.y != i.y > n.y && n.x < (i.x - r.x) * (n.y - r.y) / (i.y - r.y) + r.x && (o = !o) }
                return o }

            function polygonContainsPoint(e, n) {
                for (var t = !1, r = 0, i = e.length - 1; r < e.length; i = r++) {
                    var o = e[r],
                        u = e[i];
                    o.y > n.y != u.y > n.y && n.x < (u.x - o.x) * (n.y - o.y) / (u.y - o.y) + o.x && (t = !t) }
                return t }
            var isCounterClockwise = require("./util").isCounterClockwise;
            module.exports = { multiPolygonIntersectsBufferedMultiPoint: multiPolygonIntersectsBufferedMultiPoint, multiPolygonIntersectsMultiPolygon: multiPolygonIntersectsMultiPolygon, multiPolygonIntersectsBufferedMultiLine: multiPolygonIntersectsBufferedMultiLine, distToSegmentSquared: distToSegmentSquared };
        }, { "./util": 122 }],
        118: [function(require, module, exports) {
            "use strict";

            function LRUCache(t, e) { this.max = t, this.onRemove = e, this.reset() }
            module.exports = LRUCache, LRUCache.prototype.reset = function() {
                for (var t in this.data) this.onRemove(this.data[t]);
                return this.data = {}, this.order = [], this }, LRUCache.prototype.add = function(t, e) {
                if (this.has(t)) this.order.splice(this.order.indexOf(t), 1), this.data[t] = e, this.order.push(t);
                else if (this.data[t] = e, this.order.push(t), this.order.length > this.max) {
                    var i = this.get(this.order[0]);
                    i && this.onRemove(i) }
                return this }, LRUCache.prototype.has = function(t) {
                return t in this.data }, LRUCache.prototype.keys = function() {
                return this.order }, LRUCache.prototype.get = function(t) {
                if (!this.has(t)) return null;
                var e = this.data[t];
                return delete this.data[t], this.order.splice(this.order.indexOf(t), 1), e }, LRUCache.prototype.setMaxSize = function(t) {
                for (this.max = t; this.order.length > this.max;) {
                    var e = this.get(this.order[0]);
                    e && this.onRemove(e) }
                return this };
        }, {}],
        119: [function(require, module, exports) {
            "use strict";

            function makeAPIURL(e, r, o) {
                if (o = o || config.ACCESS_TOKEN, !o && config.REQUIRE_ACCESS_TOKEN) throw new Error("An API access token is required to use Mapbox GL. See https://www.mapbox.com/developers/api/#access-tokens");
                var t = config.API_URL + e + (r ? "?" + r : "");
                if (config.REQUIRE_ACCESS_TOKEN) {
                    if ("s" === o[0]) throw new Error("Use a public access token (pk.*) with Mapbox GL JS, not a secret access token (sk.*). See https://www.mapbox.com/developers/api/#access-tokens");
                    t += (r ? "&" : "?") + "access_token=" + o }
                return t }

            function replaceTempAccessToken(e) {
                return e.access_token && "tk." === e.access_token.slice(0, 3) ? util.extend({}, e, { access_token: config.ACCESS_TOKEN }) : e }
            var config = require("./config"),
                browser = require("./browser"),
                URL = require("url"),
                util = require("./util");
            module.exports.isMapboxURL = function(e) {
                return "mapbox:" === URL.parse(e).protocol }, module.exports.normalizeStyleURL = function(e, r) {
                var o = URL.parse(e);
                return "mapbox:" !== o.protocol ? e : makeAPIURL("/styles/v1" + o.pathname, o.query, r) }, module.exports.normalizeSourceURL = function(e, r) {
                var o = URL.parse(e);
                if ("mapbox:" !== o.protocol) return e;
                var t = e.match(/mapbox:\/\/([^?]+)/)[1];
                return makeAPIURL("/v4/" + t + ".json", o.query, r) + "&secure" }, module.exports.normalizeGlyphsURL = function(e, r) {
                var o = URL.parse(e);
                if ("mapbox:" !== o.protocol) return e;
                var t = o.pathname.split("/")[1];
                return makeAPIURL("/fonts/v1/" + t + "/{fontstack}/{range}.pbf", o.query, r) }, module.exports.normalizeSpriteURL = function(e, r, o, t) {
                var a = URL.parse(e);
                return "mapbox:" !== a.protocol ? (a.pathname += r + o, URL.format(a)) : makeAPIURL("/styles/v1" + a.pathname + "/sprite" + r + o, a.query, t) }, module.exports.normalizeTileURL = function(e, r, o) {
                var t = URL.parse(e, !0);
                if (!r) return e;
                var a = URL.parse(r);
                if ("mapbox:" !== a.protocol) return e;
                var s = browser.supportsWebp ? ".webp" : "$1",
                    n = browser.devicePixelRatio >= 2 || 512 === o ? "@2x" : "";
                return URL.format({ protocol: t.protocol, hostname: t.hostname, pathname: t.pathname.replace(/(\.(?:png|jpg)\d*)/, n + s), query: replaceTempAccessToken(t.query) }) };
        }, { "./browser": 105, "./config": 109, "./util": 122, "url": 131 }],
        120: [function(require, module, exports) {
            "use strict";

            function StructArrayType(t) {
                function e() { Struct.apply(this, arguments) }

                function r() { StructArray.apply(this, arguments), this.members = e.prototype.members }
                var i = JSON.stringify(t);
                if (structArrayTypeCache[i]) return structArrayTypeCache[i];
                void 0 === t.alignment && (t.alignment = 1), e.prototype = Object.create(Struct.prototype);
                var n = 0,
                    a = 0,
                    s = ["Uint8"];
                return e.prototype.members = t.members.map(function(r) { r = { name: r.name, type: r.type, components: r.components || 1 }, s.indexOf(r.type) < 0 && s.push(r.type);
                    var i = sizeOf(r.type);
                    a = Math.max(a, i), r.offset = n = align(n, Math.max(t.alignment, i));
                    for (var o = 0; o < r.components; o++) Object.defineProperty(e.prototype, r.name + (1 === r.components ? "" : o), { get: createGetter(r, o), set: createSetter(r, o) });
                    return n += i * r.components, r }), e.prototype.alignment = t.alignment, e.prototype.size = align(n, Math.max(a, t.alignment)), r.serialize = serializeStructArrayType, r.prototype = Object.create(StructArray.prototype), r.prototype.StructType = e, r.prototype.bytesPerElement = e.prototype.size, r.prototype.emplaceBack = createEmplaceBack(e.prototype.members, e.prototype.size), r.prototype._usedTypes = s, structArrayTypeCache[i] = r, r }

            function serializeStructArrayType() {
                return { members: this.prototype.StructType.prototype.members, alignment: this.prototype.StructType.prototype.alignment, bytesPerElement: this.prototype.bytesPerElement } }

            function align(t, e) {
                return Math.ceil(t / e) * e }

            function sizeOf(t) {
                return viewTypes[t].BYTES_PER_ELEMENT }

            function getArrayViewName(t) {
                return t.toLowerCase() }

            function createEmplaceBack(t, e) {
                for (var r = [], i = [], n = "var i = this.length;\nthis.resize(this.length + 1);\n", a = 0; a < t.length; a++) {
                    var s = t[a],
                        o = sizeOf(s.type);
                    r.indexOf(o) < 0 && (r.push(o), n += "var o" + o.toFixed(0) + " = i * " + (e / o).toFixed(0) + ";\n");
                    for (var p = 0; p < s.components; p++) {
                        var y = "v" + i.length,
                            c = "o" + o.toFixed(0) + " + " + (s.offset / o + p).toFixed(0);
                        n += "this." + getArrayViewName(s.type) + "[" + c + "] = " + y + ";\n", i.push(y) } }
                return n += "return i;", new Function(i, n) }

            function createMemberComponentString(t, e) {
                var r = "this._pos" + sizeOf(t.type).toFixed(0),
                    i = (t.offset / sizeOf(t.type) + e).toFixed(0),
                    n = r + " + " + i;
                return "this._structArray." + getArrayViewName(t.type) + "[" + n + "]" }

            function createGetter(t, e) {
                return new Function([], "return " + createMemberComponentString(t, e) + ";") }

            function createSetter(t, e) {
                return new Function(["x"], createMemberComponentString(t, e) + " = x;") }

            function Struct(t, e) { this._structArray = t, this._pos1 = e * this.size, this._pos2 = this._pos1 / 2, this._pos4 = this._pos1 / 4, this._pos8 = this._pos1 / 8 }

            function StructArray(t) { void 0 !== t ? (this.arrayBuffer = t.arrayBuffer, this.length = t.length, this.capacity = this.arrayBuffer.byteLength / this.bytesPerElement, this._refreshViews()) : (this.capacity = -1, this.resize(0)) }
            module.exports = StructArrayType;
            var viewTypes = { Int8: Int8Array, Uint8: Uint8Array, Uint8Clamped: Uint8ClampedArray, Int16: Int16Array, Uint16: Uint16Array, Int32: Int32Array, Uint32: Uint32Array, Float32: Float32Array, Float64: Float64Array },
                structArrayTypeCache = {};
            StructArray.prototype.DEFAULT_CAPACITY = 128, StructArray.prototype.RESIZE_MULTIPLIER = 5, StructArray.prototype.serialize = function() {
                return this.trim(), { length: this.length, arrayBuffer: this.arrayBuffer } }, StructArray.prototype.get = function(t) {
                return new this.StructType(this, t) }, StructArray.prototype.trim = function() { this.length !== this.capacity && (this.capacity = this.length, this.arrayBuffer = this.arrayBuffer.slice(0, this.length * this.bytesPerElement), this._refreshViews()) }, StructArray.prototype.resize = function(t) {
                if (this.length = t, t > this.capacity) { this.capacity = Math.max(t, Math.floor(this.capacity * this.RESIZE_MULTIPLIER), this.DEFAULT_CAPACITY), this.arrayBuffer = new ArrayBuffer(this.capacity * this.bytesPerElement);
                    var e = this.uint8;
                    this._refreshViews(), e && this.uint8.set(e) } }, StructArray.prototype._refreshViews = function() {
                for (var t = 0; t < this._usedTypes.length; t++) {
                    var e = this._usedTypes[t];
                    this[getArrayViewName(e)] = new viewTypes[e](this.arrayBuffer) } }, StructArray.prototype.toArray = function(t, e) {
                for (var r = [], i = t; i < e; i++) {
                    var n = this.get(i);
                    r.push(n) }
                return r };
        }, {}],
        121: [function(require, module, exports) {
            "use strict";

            function resolveTokens(e, n) {
                return n.replace(/{([^{}]+)}/g, function(n, r) {
                    return r in e ? e[r] : "" }) }
            module.exports = resolveTokens;
        }, {}],
        122: [function(require, module, exports) {
            "use strict";
            var UnitBezier = require("unitbezier"),
                Coordinate = require("../geo/coordinate");
            exports.easeCubicInOut = function(r) {
                if (r <= 0) return 0;
                if (r >= 1) return 1;
                var t = r * r,
                    n = t * r;
                return 4 * (r < .5 ? n : 3 * (r - t) + n - .75) }, exports.bezier = function(r, t, n, e) {
                var o = new UnitBezier(r, t, n, e);
                return function(r) {
                    return o.solve(r) } }, exports.ease = exports.bezier(.25, .1, .25, 1), exports.clamp = function(r, t, n) {
                return Math.min(n, Math.max(t, r)) }, exports.wrap = function(r, t, n) {
                var e = n - t,
                    o = ((r - t) % e + e) % e + t;
                return o === t ? n : o }, exports.coalesce = function() {
                for (var r = 0; r < arguments.length; r++) {
                    var t = arguments[r];
                    if (null !== t && void 0 !== t) return t } }, exports.asyncAll = function(r, t, n) {
                if (!r.length) return n(null, []);
                var e = r.length,
                    o = new Array(r.length),
                    i = null;
                r.forEach(function(r, a) { t(r, function(r, t) { r && (i = r), o[a] = t, 0 === --e && n(i, o) }) }) }, exports.keysDifference = function(r, t) {
                var n = [];
                for (var e in r) e in t || n.push(e);
                return n }, exports.extend = function(r) {
                for (var t = 1; t < arguments.length; t++) {
                    var n = arguments[t];
                    for (var e in n) r[e] = n[e] }
                return r }, exports.extendAll = function(r, t) {
                for (var n in t) Object.defineProperty(r, n, Object.getOwnPropertyDescriptor(t, n));
                return r }, exports.inherit = function(r, t) {
                var n = "function" == typeof r ? r.prototype : r,
                    e = Object.create(n);
                return exports.extendAll(e, t), e }, exports.pick = function(r, t) {
                for (var n = {}, e = 0; e < t.length; e++) {
                    var o = t[e];
                    o in r && (n[o] = r[o]) }
                return n };
            var id = 1;
            exports.uniqueId = function() {
                return id++ }, exports.debounce = function(r, t) {
                var n, e;
                return function() { e = arguments, clearTimeout(n), n = setTimeout(function() { r.apply(null, e) }, t) } }, exports.bindAll = function(r, t) { r.forEach(function(r) { t[r] && (t[r] = t[r].bind(t)) }) }, exports.bindHandlers = function(r) {
                for (var t in r) "function" == typeof r[t] && 0 === t.indexOf("_on") && (r[t] = r[t].bind(r)) }, exports.setOptions = function(r, t) { r.hasOwnProperty("options") || (r.options = r.options ? Object.create(r.options) : {});
                for (var n in t) r.options[n] = t[n];
                return r.options }, exports.getCoordinatesCenter = function(r) {
                for (var t = 1 / 0, n = 1 / 0, e = -(1 / 0), o = -(1 / 0), i = 0; i < r.length; i++) t = Math.min(t, r[i].column), n = Math.min(n, r[i].row), e = Math.max(e, r[i].column), o = Math.max(o, r[i].row);
                var a = e - t,
                    u = o - n,
                    s = Math.max(a, u);
                return new Coordinate((t + e) / 2, (n + o) / 2, 0).zoomTo(Math.floor(-Math.log(s) / Math.LN2)) }, exports.endsWith = function(r, t) {
                return r.indexOf(t, r.length - t.length) !== -1 }, exports.startsWith = function(r, t) {
                return 0 === r.indexOf(t) }, exports.mapObject = function(r, t, n) {
                var e = {};
                for (var o in r) e[o] = t.call(n || this, r[o], o, r);
                return e }, exports.filterObject = function(r, t, n) {
                var e = {};
                for (var o in r) t.call(n || this, r[o], o, r) && (e[o] = r[o]);
                return e }, exports.deepEqual = function(r, t) {
                if (Array.isArray(r)) {
                    if (!Array.isArray(t) || r.length !== t.length) return !1;
                    for (var n = 0; n < r.length; n++)
                        if (!exports.deepEqual(r[n], t[n])) return !1;
                    return !0 }
                if ("object" == typeof r && null !== r && null !== t) {
                    if ("object" != typeof t) return !1;
                    var e = Object.keys(r);
                    if (e.length !== Object.keys(t).length) return !1;
                    for (var o in r)
                        if (!exports.deepEqual(r[o], t[o])) return !1;
                    return !0 }
                return r === t }, exports.clone = function(r) {
                return Array.isArray(r) ? r.map(exports.clone) : "object" == typeof r ? exports.mapObject(r, exports.clone) : r }, exports.arraysIntersect = function(r, t) {
                for (var n = 0; n < r.length; n++)
                    if (t.indexOf(r[n]) >= 0) return !0;
                return !1 };
            var warnOnceHistory = {};
            exports.warnOnce = function(r) { warnOnceHistory[r] || ("undefined" != typeof console && console.warn(r), warnOnceHistory[r] = !0) }, exports.isCounterClockwise = function(r, t, n) {
                return (n.y - r.y) * (t.x - r.x) > (t.y - r.y) * (n.x - r.x) }, exports.calculateSignedArea = function(r) {
                for (var t, n, e = 0, o = 0, i = r.length, a = i - 1; o < i; a = o++) t = r[o], n = r[a], e += (n.x - t.x) * (t.y + n.y);
                return e }, exports.isClosedPolygon = function(r) {
                if (r.length < 4) return !1;
                var t = r[0],
                    n = r[r.length - 1];
                return !(Math.abs(t.x - n.x) > 0 || Math.abs(t.y - n.y) > 0) && Math.abs(exports.calculateSignedArea(r)) > .01 }, exports.sphericalToCartesian = function(r) {
                var t = r[0],
                    n = r[1],
                    e = r[2];
                return n += 90, n *= Math.PI / 180, e *= Math.PI / 180, [t * Math.cos(n) * Math.sin(e), t * Math.sin(n) * Math.sin(e), t * Math.cos(e)] };
        }, { "../geo/coordinate": 12, "unitbezier": 201 }],
        123: [function(require, module, exports) {
            "use strict";

            function Feature(e, t, r, i) { this._vectorTileFeature = e, e._z = t, e._x = r, e._y = i, this.properties = e.properties, null != e.id && (this.id = e.id) }
            module.exports = Feature, Feature.prototype = { type: "Feature", get geometry() {
                    return void 0 === this._geometry && (this._geometry = this._vectorTileFeature.toGeoJSON(this._vectorTileFeature._x, this._vectorTileFeature._y, this._vectorTileFeature._z).geometry), this._geometry }, set geometry(e) { this._geometry = e }, toJSON: function() {
                    var e = {};
                    for (var t in this) "_geometry" !== t && "_vectorTileFeature" !== t && "toJSON" !== t && (e[t] = this[t]);
                    return e } };
        }, {}],
        124: [function(require, module, exports) {
            "use strict";

            function WorkerPool() { this.active = {} }
            var WebWorker = require("./web_worker");
            module.exports = WorkerPool, WorkerPool.prototype = { acquire: function(e) {
                    if (!this.workers) {
                        var r = require("../mapbox-gl").workerCount;
                        for (this.workers = []; this.workers.length < r;) this.workers.push(new WebWorker) }
                    return this.active[e] = !0, this.workers.slice() }, release: function(e) { delete this.active[e], 0 === Object.keys(this.active).length && (this.workers.forEach(function(e) { e.terminate() }), this.workers = null) } };
        }, { "../mapbox-gl": 18, "./web_worker": 106 }],
        125: [function(require, module, exports) {
            (function(process) {
                function normalizeArray(r, t) {
                    for (var e = 0, n = r.length - 1; n >= 0; n--) {
                        var s = r[n]; "." === s ? r.splice(n, 1) : ".." === s ? (r.splice(n, 1), e++) : e && (r.splice(n, 1), e--) }
                    if (t)
                        for (; e--; e) r.unshift("..");
                    return r }

                function filter(r, t) {
                    if (r.filter) return r.filter(t);
                    for (var e = [], n = 0; n < r.length; n++) t(r[n], n, r) && e.push(r[n]);
                    return e }
                var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,
                    splitPath = function(r) {
                        return splitPathRe.exec(r).slice(1) };
                exports.resolve = function() {
                    for (var r = "", t = !1, e = arguments.length - 1; e >= -1 && !t; e--) {
                        var n = e >= 0 ? arguments[e] : process.cwd();
                        if ("string" != typeof n) throw new TypeError("Arguments to path.resolve must be strings");
                        n && (r = n + "/" + r, t = "/" === n.charAt(0)) }
                    return r = normalizeArray(filter(r.split("/"), function(r) {
                        return !!r }), !t).join("/"), (t ? "/" : "") + r || "." }, exports.normalize = function(r) {
                    var t = exports.isAbsolute(r),
                        e = "/" === substr(r, -1);
                    return r = normalizeArray(filter(r.split("/"), function(r) {
                        return !!r }), !t).join("/"), r || t || (r = "."), r && e && (r += "/"), (t ? "/" : "") + r }, exports.isAbsolute = function(r) {
                    return "/" === r.charAt(0) }, exports.join = function() {
                    var r = Array.prototype.slice.call(arguments, 0);
                    return exports.normalize(filter(r, function(r, t) {
                        if ("string" != typeof r) throw new TypeError("Arguments to path.join must be strings");
                        return r }).join("/")) }, exports.relative = function(r, t) {
                    function e(r) {
                        for (var t = 0; t < r.length && "" === r[t]; t++);
                        for (var e = r.length - 1; e >= 0 && "" === r[e]; e--);
                        return t > e ? [] : r.slice(t, e - t + 1) }
                    r = exports.resolve(r).substr(1), t = exports.resolve(t).substr(1);
                    for (var n = e(r.split("/")), s = e(t.split("/")), i = Math.min(n.length, s.length), o = i, u = 0; u < i; u++)
                        if (n[u] !== s[u]) { o = u;
                            break }
                    for (var l = [], u = o; u < n.length; u++) l.push("..");
                    return l = l.concat(s.slice(o)), l.join("/") }, exports.sep = "/", exports.delimiter = ":", exports.dirname = function(r) {
                    var t = splitPath(r),
                        e = t[0],
                        n = t[1];
                    return e || n ? (n && (n = n.substr(0, n.length - 1)), e + n) : "." }, exports.basename = function(r, t) {
                    var e = splitPath(r)[2];
                    return t && e.substr(-1 * t.length) === t && (e = e.substr(0, e.length - t.length)), e }, exports.extname = function(r) {
                    return splitPath(r)[3] };
                var substr = "b" === "ab".substr(-1) ? function(r, t, e) {
                    return r.substr(t, e) } : function(r, t, e) {
                    return t < 0 && (t = r.length + t), r.substr(t, e) };
            }).call(this, require('_process'))

        }, { "_process": 126 }],
        126: [function(require, module, exports) {
            function defaultSetTimout() {
                throw new Error("setTimeout has not been defined") }

            function defaultClearTimeout() {
                throw new Error("clearTimeout has not been defined") }

            function runTimeout(e) {
                if (cachedSetTimeout === setTimeout) return setTimeout(e, 0);
                if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(e, 0);
                try {
                    return cachedSetTimeout(e, 0) } catch (t) {
                    try {
                        return cachedSetTimeout.call(null, e, 0) } catch (t) {
                        return cachedSetTimeout.call(this, e, 0) } } }

            function runClearTimeout(e) {
                if (cachedClearTimeout === clearTimeout) return clearTimeout(e);
                if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(e);
                try {
                    return cachedClearTimeout(e) } catch (t) {
                    try {
                        return cachedClearTimeout.call(null, e) } catch (t) {
                        return cachedClearTimeout.call(this, e) } } }

            function cleanUpNextTick() { draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue()) }

            function drainQueue() {
                if (!draining) {
                    var e = runTimeout(cleanUpNextTick);
                    draining = !0;
                    for (var t = queue.length; t;) {
                        for (currentQueue = queue, queue = []; ++queueIndex < t;) currentQueue && currentQueue[queueIndex].run();
                        queueIndex = -1, t = queue.length }
                    currentQueue = null, draining = !1, runClearTimeout(e) } }

            function Item(e, t) { this.fun = e, this.array = t }

            function noop() {}
            var process = module.exports = {},
                cachedSetTimeout, cachedClearTimeout;
            ! function() {
                try { cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout } catch (e) { cachedSetTimeout = defaultSetTimout }
                try { cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout } catch (e) { cachedClearTimeout = defaultClearTimeout } }();
            var queue = [],
                draining = !1,
                currentQueue, queueIndex = -1;
            process.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1)
                    for (var u = 1; u < arguments.length; u++) t[u - 1] = arguments[u];
                queue.push(new Item(e, t)), 1 !== queue.length || draining || runTimeout(drainQueue) }, Item.prototype.run = function() { this.fun.apply(null, this.array) }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, process.emit = noop, process.binding = function(e) {
                throw new Error("process.binding is not supported") }, process.cwd = function() {
                return "/" }, process.chdir = function(e) {
                throw new Error("process.chdir is not supported") }, process.umask = function() {
                return 0 };
        }, {}],
        127: [function(require, module, exports) {
            (function(global) {
                ! function(e) {
                    function o(e) {
                        throw new RangeError(T[e]) }

                    function n(e, o) {
                        for (var n = e.length, r = []; n--;) r[n] = o(e[n]);
                        return r }

                    function r(e, o) {
                        var r = e.split("@"),
                            t = "";
                        r.length > 1 && (t = r[0] + "@", e = r[1]), e = e.replace(S, ".");
                        var u = e.split("."),
                            i = n(u, o).join(".");
                        return t + i }

                    function t(e) {
                        for (var o, n, r = [], t = 0, u = e.length; t < u;) o = e.charCodeAt(t++), o >= 55296 && o <= 56319 && t < u ? (n = e.charCodeAt(t++), 56320 == (64512 & n) ? r.push(((1023 & o) << 10) + (1023 & n) + 65536) : (r.push(o), t--)) : r.push(o);
                        return r }

                    function u(e) {
                        return n(e, function(e) {
                            var o = "";
                            return e > 65535 && (e -= 65536, o += P(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += P(e) }).join("") }

                    function i(e) {
                        return e - 48 < 10 ? e - 22 : e - 65 < 26 ? e - 65 : e - 97 < 26 ? e - 97 : b }

                    function f(e, o) {
                        return e + 22 + 75 * (e < 26) - ((0 != o) << 5) }

                    function c(e, o, n) {
                        var r = 0;
                        for (e = n ? M(e / j) : e >> 1, e += M(e / o); e > L * C >> 1; r += b) e = M(e / L);
                        return M(r + (L + 1) * e / (e + m)) }

                    function l(e) {
                        var n, r, t, f, l, s, d, a, p, h, v = [],
                            g = e.length,
                            w = 0,
                            m = I,
                            j = A;
                        for (r = e.lastIndexOf(E), r < 0 && (r = 0), t = 0; t < r; ++t) e.charCodeAt(t) >= 128 && o("not-basic"), v.push(e.charCodeAt(t));
                        for (f = r > 0 ? r + 1 : 0; f < g;) {
                            for (l = w, s = 1, d = b; f >= g && o("invalid-input"), a = i(e.charCodeAt(f++)), (a >= b || a > M((x - w) / s)) && o("overflow"), w += a * s, p = d <= j ? y : d >= j + C ? C : d - j, !(a < p); d += b) h = b - p, s > M(x / h) && o("overflow"), s *= h;
                            n = v.length + 1, j = c(w - l, n, 0 == l), M(w / n) > x - m && o("overflow"), m += M(w / n), w %= n, v.splice(w++, 0, m) }
                        return u(v) }

                    function s(e) {
                        var n, r, u, i, l, s, d, a, p, h, v, g, w, m, j, F = [];
                        for (e = t(e), g = e.length, n = I, r = 0, l = A, s = 0; s < g; ++s) v = e[s], v < 128 && F.push(P(v));
                        for (u = i = F.length, i && F.push(E); u < g;) {
                            for (d = x, s = 0; s < g; ++s) v = e[s], v >= n && v < d && (d = v);
                            for (w = u + 1, d - n > M((x - r) / w) && o("overflow"), r += (d - n) * w, n = d, s = 0; s < g; ++s)
                                if (v = e[s], v < n && ++r > x && o("overflow"), v == n) {
                                    for (a = r, p = b; h = p <= l ? y : p >= l + C ? C : p - l, !(a < h); p += b) j = a - h, m = b - h, F.push(P(f(h + j % m, 0))), a = M(j / m);
                                    F.push(P(f(a, 0))), l = c(r, w, u == i), r = 0, ++u }++r, ++n }
                        return F.join("") }

                    function d(e) {
                        return r(e, function(e) {
                            return F.test(e) ? l(e.slice(4).toLowerCase()) : e }) }

                    function a(e) {
                        return r(e, function(e) {
                            return O.test(e) ? "xn--" + s(e) : e }) }
                    var p = "object" == typeof exports && exports && !exports.nodeType && exports,
                        h = "object" == typeof module && module && !module.nodeType && module,
                        v = "object" == typeof global && global;
                    v.global !== v && v.window !== v && v.self !== v || (e = v);
                    var g, w, x = 2147483647,
                        b = 36,
                        y = 1,
                        C = 26,
                        m = 38,
                        j = 700,
                        A = 72,
                        I = 128,
                        E = "-",
                        F = /^xn--/,
                        O = /[^\x20-\x7E]/,
                        S = /[\x2E\u3002\uFF0E\uFF61]/g,
                        T = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" },
                        L = b - y,
                        M = Math.floor,
                        P = String.fromCharCode;
                    if (g = { version: "1.4.1", ucs2: { decode: t, encode: u }, decode: l, encode: s, toASCII: a, toUnicode: d }, "function" == typeof define && "object" == typeof define.amd && define.amd) define("punycode", function() {
                        return g });
                    else if (p && h)
                        if (module.exports == p) h.exports = g;
                        else
                            for (w in g) g.hasOwnProperty(w) && (p[w] = g[w]);
                    else e.punycode = g }(this);
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, {}],
        128: [function(require, module, exports) {
            "use strict";

            function hasOwnProperty(r, e) {
                return Object.prototype.hasOwnProperty.call(r, e) }
            module.exports = function(r, e, t, n) { e = e || "&", t = t || "=";
                var o = {};
                if ("string" != typeof r || 0 === r.length) return o;
                var a = /\+/g;
                r = r.split(e);
                var s = 1e3;
                n && "number" == typeof n.maxKeys && (s = n.maxKeys);
                var p = r.length;
                s > 0 && p > s && (p = s);
                for (var y = 0; y < p; ++y) {
                    var u, c, i, l, f = r[y].replace(a, "%20"),
                        v = f.indexOf(t);
                    v >= 0 ? (u = f.substr(0, v), c = f.substr(v + 1)) : (u = f, c = ""), i = decodeURIComponent(u), l = decodeURIComponent(c), hasOwnProperty(o, i) ? isArray(o[i]) ? o[i].push(l) : o[i] = [o[i], l] : o[i] = l }
                return o };
            var isArray = Array.isArray || function(r) {
                return "[object Array]" === Object.prototype.toString.call(r) };
        }, {}],
        129: [function(require, module, exports) {
            "use strict";

            function map(r, e) {
                if (r.map) return r.map(e);
                for (var t = [], n = 0; n < r.length; n++) t.push(e(r[n], n));
                return t }
            var stringifyPrimitive = function(r) {
                switch (typeof r) {
                    case "string":
                        return r;
                    case "boolean":
                        return r ? "true" : "false";
                    case "number":
                        return isFinite(r) ? r : "";
                    default:
                        return "" } };
            module.exports = function(r, e, t, n) {
                return e = e || "&", t = t || "=", null === r && (r = void 0), "object" == typeof r ? map(objectKeys(r), function(n) {
                    var i = encodeURIComponent(stringifyPrimitive(n)) + t;
                    return isArray(r[n]) ? map(r[n], function(r) {
                        return i + encodeURIComponent(stringifyPrimitive(r)) }).join(e) : i + encodeURIComponent(stringifyPrimitive(r[n])) }).join(e) : n ? encodeURIComponent(stringifyPrimitive(n)) + t + encodeURIComponent(stringifyPrimitive(r)) : "" };
            var isArray = Array.isArray || function(r) {
                    return "[object Array]" === Object.prototype.toString.call(r) },
                objectKeys = Object.keys || function(r) {
                    var e = [];
                    for (var t in r) Object.prototype.hasOwnProperty.call(r, t) && e.push(t);
                    return e };
        }, {}],
        130: [function(require, module, exports) {
            "use strict";
            exports.decode = exports.parse = require("./decode"), exports.encode = exports.stringify = require("./encode");
        }, { "./decode": 128, "./encode": 129 }],
        131: [function(require, module, exports) {
            "use strict";

            function Url() { this.protocol = null, this.slashes = null, this.auth = null, this.host = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.query = null, this.pathname = null, this.path = null, this.href = null }

            function urlParse(t, s, e) {
                if (t && util.isObject(t) && t instanceof Url) return t;
                var h = new Url;
                return h.parse(t, s, e), h }

            function urlFormat(t) {
                return util.isString(t) && (t = urlParse(t)), t instanceof Url ? t.format() : Url.prototype.format.call(t) }

            function urlResolve(t, s) {
                return urlParse(t, !1, !0).resolve(s) }

            function urlResolveObject(t, s) {
                return t ? urlParse(t, !1, !0).resolveObject(s) : s }
            var punycode = require("punycode"),
                util = require("./util");
            exports.parse = urlParse, exports.resolve = urlResolve, exports.resolveObject = urlResolveObject, exports.format = urlFormat, exports.Url = Url;
            var protocolPattern = /^([a-z0-9.+-]+:)/i,
                portPattern = /:[0-9]*$/,
                simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,
                delims = ["<", ">", '"', "`", " ", "\r", "\n", "\t"],
                unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims),
                autoEscape = ["'"].concat(unwise),
                nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape),
                hostEndingChars = ["/", "?", "#"],
                hostnameMaxLen = 255,
                hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
                hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
                unsafeProtocol = { javascript: !0, "javascript:": !0 },
                hostlessProtocol = { javascript: !0, "javascript:": !0 },
                slashedProtocol = { http: !0, https: !0, ftp: !0, gopher: !0, file: !0, "http:": !0, "https:": !0, "ftp:": !0, "gopher:": !0, "file:": !0 },
                querystring = require("querystring");
            Url.prototype.parse = function(t, s, e) {
                if (!util.isString(t)) throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
                var h = t.indexOf("?"),
                    r = h !== -1 && h < t.indexOf("#") ? "?" : "#",
                    a = t.split(r),
                    o = /\\/g;
                a[0] = a[0].replace(o, "/"), t = a.join(r);
                var n = t;
                if (n = n.trim(), !e && 1 === t.split("#").length) {
                    var i = simplePathPattern.exec(n);
                    if (i) return this.path = n, this.href = n, this.pathname = i[1], i[2] ? (this.search = i[2], s ? this.query = querystring.parse(this.search.substr(1)) : this.query = this.search.substr(1)) : s && (this.search = "", this.query = {}), this }
                var l = protocolPattern.exec(n);
                if (l) { l = l[0];
                    var u = l.toLowerCase();
                    this.protocol = u, n = n.substr(l.length) }
                if (e || l || n.match(/^\/\/[^@\/]+@[^@\/]+/)) {
                    var p = "//" === n.substr(0, 2);!p || l && hostlessProtocol[l] || (n = n.substr(2), this.slashes = !0) }
                if (!hostlessProtocol[l] && (p || l && !slashedProtocol[l])) {
                    for (var c = -1, f = 0; f < hostEndingChars.length; f++) {
                        var m = n.indexOf(hostEndingChars[f]);
                        m !== -1 && (c === -1 || m < c) && (c = m) }
                    var v, g;
                    g = c === -1 ? n.lastIndexOf("@") : n.lastIndexOf("@", c), g !== -1 && (v = n.slice(0, g), n = n.slice(g + 1), this.auth = decodeURIComponent(v)), c = -1;
                    for (var f = 0; f < nonHostChars.length; f++) {
                        var m = n.indexOf(nonHostChars[f]);
                        m !== -1 && (c === -1 || m < c) && (c = m) }
                    c === -1 && (c = n.length), this.host = n.slice(0, c), n = n.slice(c), this.parseHost(), this.hostname = this.hostname || "";
                    var y = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
                    if (!y)
                        for (var P = this.hostname.split(/\./), f = 0, d = P.length; f < d; f++) {
                            var q = P[f];
                            if (q && !q.match(hostnamePartPattern)) {
                                for (var b = "", O = 0, j = q.length; O < j; O++) b += q.charCodeAt(O) > 127 ? "x" : q[O];
                                if (!b.match(hostnamePartPattern)) {
                                    var x = P.slice(0, f),
                                        U = P.slice(f + 1),
                                        C = q.match(hostnamePartStart);
                                    C && (x.push(C[1]), U.unshift(C[2])), U.length && (n = "/" + U.join(".") + n), this.hostname = x.join(".");
                                    break } } }
                    this.hostname.length > hostnameMaxLen ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(), y || (this.hostname = punycode.toASCII(this.hostname));
                    var A = this.port ? ":" + this.port : "",
                        w = this.hostname || "";
                    this.host = w + A, this.href += this.host, y && (this.hostname = this.hostname.substr(1, this.hostname.length - 2), "/" !== n[0] && (n = "/" + n)) }
                if (!unsafeProtocol[u])
                    for (var f = 0, d = autoEscape.length; f < d; f++) {
                        var E = autoEscape[f];
                        if (n.indexOf(E) !== -1) {
                            var I = encodeURIComponent(E);
                            I === E && (I = escape(E)), n = n.split(E).join(I) } }
                var R = n.indexOf("#");
                R !== -1 && (this.hash = n.substr(R), n = n.slice(0, R));
                var S = n.indexOf("?");
                if (S !== -1 ? (this.search = n.substr(S), this.query = n.substr(S + 1), s && (this.query = querystring.parse(this.query)), n = n.slice(0, S)) : s && (this.search = "", this.query = {}), n && (this.pathname = n), slashedProtocol[u] && this.hostname && !this.pathname && (this.pathname = "/"), this.pathname || this.search) {
                    var A = this.pathname || "",
                        k = this.search || "";
                    this.path = A + k }
                return this.href = this.format(), this }, Url.prototype.format = function() {
                var t = this.auth || "";
                t && (t = encodeURIComponent(t), t = t.replace(/%3A/i, ":"), t += "@");
                var s = this.protocol || "",
                    e = this.pathname || "",
                    h = this.hash || "",
                    r = !1,
                    a = "";
                this.host ? r = t + this.host : this.hostname && (r = t + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]"), this.port && (r += ":" + this.port)), this.query && util.isObject(this.query) && Object.keys(this.query).length && (a = querystring.stringify(this.query));
                var o = this.search || a && "?" + a || "";
                return s && ":" !== s.substr(-1) && (s += ":"), this.slashes || (!s || slashedProtocol[s]) && r !== !1 ? (r = "//" + (r || ""), e && "/" !== e.charAt(0) && (e = "/" + e)) : r || (r = ""), h && "#" !== h.charAt(0) && (h = "#" + h), o && "?" !== o.charAt(0) && (o = "?" + o), e = e.replace(/[?#]/g, function(t) {
                    return encodeURIComponent(t) }), o = o.replace("#", "%23"), s + r + e + o + h }, Url.prototype.resolve = function(t) {
                return this.resolveObject(urlParse(t, !1, !0)).format() }, Url.prototype.resolveObject = function(t) {
                if (util.isString(t)) {
                    var s = new Url;
                    s.parse(t, !1, !0), t = s }
                for (var e = new Url, h = Object.keys(this), r = 0; r < h.length; r++) {
                    var a = h[r];
                    e[a] = this[a] }
                if (e.hash = t.hash, "" === t.href) return e.href = e.format(), e;
                if (t.slashes && !t.protocol) {
                    for (var o = Object.keys(t), n = 0; n < o.length; n++) {
                        var i = o[n]; "protocol" !== i && (e[i] = t[i]) }
                    return slashedProtocol[e.protocol] && e.hostname && !e.pathname && (e.path = e.pathname = "/"), e.href = e.format(), e }
                if (t.protocol && t.protocol !== e.protocol) {
                    if (!slashedProtocol[t.protocol]) {
                        for (var l = Object.keys(t), u = 0; u < l.length; u++) {
                            var p = l[u];
                            e[p] = t[p] }
                        return e.href = e.format(), e }
                    if (e.protocol = t.protocol, t.host || hostlessProtocol[t.protocol]) e.pathname = t.pathname;
                    else {
                        for (var c = (t.pathname || "").split("/"); c.length && !(t.host = c.shift()););
                        t.host || (t.host = ""), t.hostname || (t.hostname = ""), "" !== c[0] && c.unshift(""), c.length < 2 && c.unshift(""), e.pathname = c.join("/") }
                    if (e.search = t.search, e.query = t.query, e.host = t.host || "", e.auth = t.auth, e.hostname = t.hostname || t.host, e.port = t.port, e.pathname || e.search) {
                        var f = e.pathname || "",
                            m = e.search || "";
                        e.path = f + m }
                    return e.slashes = e.slashes || t.slashes, e.href = e.format(), e }
                var v = e.pathname && "/" === e.pathname.charAt(0),
                    g = t.host || t.pathname && "/" === t.pathname.charAt(0),
                    y = g || v || e.host && t.pathname,
                    P = y,
                    d = e.pathname && e.pathname.split("/") || [],
                    c = t.pathname && t.pathname.split("/") || [],
                    q = e.protocol && !slashedProtocol[e.protocol];
                if (q && (e.hostname = "", e.port = null, e.host && ("" === d[0] ? d[0] = e.host : d.unshift(e.host)), e.host = "", t.protocol && (t.hostname = null, t.port = null, t.host && ("" === c[0] ? c[0] = t.host : c.unshift(t.host)), t.host = null), y = y && ("" === c[0] || "" === d[0])), g) e.host = t.host || "" === t.host ? t.host : e.host, e.hostname = t.hostname || "" === t.hostname ? t.hostname : e.hostname, e.search = t.search, e.query = t.query, d = c;
                else if (c.length) d || (d = []), d.pop(), d = d.concat(c), e.search = t.search, e.query = t.query;
                else if (!util.isNullOrUndefined(t.search)) {
                    if (q) { e.hostname = e.host = d.shift();
                        var b = !!(e.host && e.host.indexOf("@") > 0) && e.host.split("@");
                        b && (e.auth = b.shift(), e.host = e.hostname = b.shift()) }
                    return e.search = t.search, e.query = t.query, util.isNull(e.pathname) && util.isNull(e.search) || (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.href = e.format(), e }
                if (!d.length) return e.pathname = null, e.search ? e.path = "/" + e.search : e.path = null, e.href = e.format(), e;
                for (var O = d.slice(-1)[0], j = (e.host || t.host || d.length > 1) && ("." === O || ".." === O) || "" === O, x = 0, U = d.length; U >= 0; U--) O = d[U], "." === O ? d.splice(U, 1) : ".." === O ? (d.splice(U, 1), x++) : x && (d.splice(U, 1), x--);
                if (!y && !P)
                    for (; x--; x) d.unshift("..");!y || "" === d[0] || d[0] && "/" === d[0].charAt(0) || d.unshift(""), j && "/" !== d.join("/").substr(-1) && d.push("");
                var C = "" === d[0] || d[0] && "/" === d[0].charAt(0);
                if (q) { e.hostname = e.host = C ? "" : d.length ? d.shift() : "";
                    var b = !!(e.host && e.host.indexOf("@") > 0) && e.host.split("@");
                    b && (e.auth = b.shift(), e.host = e.hostname = b.shift()) }
                return y = y || e.host && d.length, y && !C && d.unshift(""), d.length ? e.pathname = d.join("/") : (e.pathname = null, e.path = null), util.isNull(e.pathname) && util.isNull(e.search) || (e.path = (e.pathname ? e.pathname : "") + (e.search ? e.search : "")), e.auth = t.auth || e.auth, e.slashes = e.slashes || t.slashes, e.href = e.format(), e }, Url.prototype.parseHost = function() {
                var t = this.host,
                    s = portPattern.exec(t);
                s && (s = s[0], ":" !== s && (this.port = s.substr(1)), t = t.substr(0, t.length - s.length)), t && (this.hostname = t) };
        }, { "./util": 132, "punycode": 127, "querystring": 130 }],
        132: [function(require, module, exports) {
            "use strict";
            module.exports = { isString: function(n) {
                    return "string" == typeof n }, isObject: function(n) {
                    return "object" == typeof n && null !== n }, isNull: function(n) {
                    return null === n }, isNullOrUndefined: function(n) {
                    return null == n } };
        }, {}],
        133: [function(require, module, exports) {
            "function" == typeof Object.create ? module.exports = function(t, e) { t.super_ = e, t.prototype = Object.create(e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }) } : module.exports = function(t, e) { t.super_ = e;
                var o = function() {};
                o.prototype = e.prototype, t.prototype = new o, t.prototype.constructor = t };
        }, {}],
        134: [function(require, module, exports) {
            module.exports = function(o) {
                return o && "object" == typeof o && "function" == typeof o.copy && "function" == typeof o.fill && "function" == typeof o.readUInt8 };
        }, {}],
        135: [function(require, module, exports) {
            (function(process, global) {
                function inspect(e, r) {
                    var t = { seen: [], stylize: stylizeNoColor };
                    return arguments.length >= 3 && (t.depth = arguments[2]), arguments.length >= 4 && (t.colors = arguments[3]), isBoolean(r) ? t.showHidden = r : r && exports._extend(t, r), isUndefined(t.showHidden) && (t.showHidden = !1), isUndefined(t.depth) && (t.depth = 2), isUndefined(t.colors) && (t.colors = !1), isUndefined(t.customInspect) && (t.customInspect = !0), t.colors && (t.stylize = stylizeWithColor), formatValue(t, e, t.depth) }

                function stylizeWithColor(e, r) {
                    var t = inspect.styles[r];
                    return t ? "[" + inspect.colors[t][0] + "m" + e + "[" + inspect.colors[t][1] + "m" : e }

                function stylizeNoColor(e, r) {
                    return e }

                function arrayToHash(e) {
                    var r = {};
                    return e.forEach(function(e, t) { r[e] = !0 }), r }

                function formatValue(e, r, t) {
                    if (e.customInspect && r && isFunction(r.inspect) && r.inspect !== exports.inspect && (!r.constructor || r.constructor.prototype !== r)) {
                        var n = r.inspect(t, e);
                        return isString(n) || (n = formatValue(e, n, t)), n }
                    var i = formatPrimitive(e, r);
                    if (i) return i;
                    var o = Object.keys(r),
                        s = arrayToHash(o);
                    if (e.showHidden && (o = Object.getOwnPropertyNames(r)), isError(r) && (o.indexOf("message") >= 0 || o.indexOf("description") >= 0)) return formatError(r);
                    if (0 === o.length) {
                        if (isFunction(r)) {
                            var u = r.name ? ": " + r.name : "";
                            return e.stylize("[Function" + u + "]", "special") }
                        if (isRegExp(r)) return e.stylize(RegExp.prototype.toString.call(r), "regexp");
                        if (isDate(r)) return e.stylize(Date.prototype.toString.call(r), "date");
                        if (isError(r)) return formatError(r) }
                    var c = "",
                        a = !1,
                        l = ["{", "}"];
                    if (isArray(r) && (a = !0, l = ["[", "]"]), isFunction(r)) {
                        var p = r.name ? ": " + r.name : "";
                        c = " [Function" + p + "]" }
                    if (isRegExp(r) && (c = " " + RegExp.prototype.toString.call(r)), isDate(r) && (c = " " + Date.prototype.toUTCString.call(r)), isError(r) && (c = " " + formatError(r)), 0 === o.length && (!a || 0 == r.length)) return l[0] + c + l[1];
                    if (t < 0) return isRegExp(r) ? e.stylize(RegExp.prototype.toString.call(r), "regexp") : e.stylize("[Object]", "special");
                    e.seen.push(r);
                    var f;
                    return f = a ? formatArray(e, r, t, s, o) : o.map(function(n) {
                        return formatProperty(e, r, t, s, n, a) }), e.seen.pop(), reduceToSingleString(f, c, l) }

                function formatPrimitive(e, r) {
                    if (isUndefined(r)) return e.stylize("undefined", "undefined");
                    if (isString(r)) {
                        var t = "'" + JSON.stringify(r).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                        return e.stylize(t, "string") }
                    return isNumber(r) ? e.stylize("" + r, "number") : isBoolean(r) ? e.stylize("" + r, "boolean") : isNull(r) ? e.stylize("null", "null") : void 0 }

                function formatError(e) {
                    return "[" + Error.prototype.toString.call(e) + "]" }

                function formatArray(e, r, t, n, i) {
                    for (var o = [], s = 0, u = r.length; s < u; ++s) hasOwnProperty(r, String(s)) ? o.push(formatProperty(e, r, t, n, String(s), !0)) : o.push("");
                    return i.forEach(function(i) { i.match(/^\d+$/) || o.push(formatProperty(e, r, t, n, i, !0)) }), o }

                function formatProperty(e, r, t, n, i, o) {
                    var s, u, c;
                    if (c = Object.getOwnPropertyDescriptor(r, i) || { value: r[i] }, c.get ? u = c.set ? e.stylize("[Getter/Setter]", "special") : e.stylize("[Getter]", "special") : c.set && (u = e.stylize("[Setter]", "special")), hasOwnProperty(n, i) || (s = "[" + i + "]"), u || (e.seen.indexOf(c.value) < 0 ? (u = isNull(t) ? formatValue(e, c.value, null) : formatValue(e, c.value, t - 1), u.indexOf("\n") > -1 && (u = o ? u.split("\n").map(function(e) {
                            return "  " + e }).join("\n").substr(2) : "\n" + u.split("\n").map(function(e) {
                            return "   " + e }).join("\n"))) : u = e.stylize("[Circular]", "special")), isUndefined(s)) {
                        if (o && i.match(/^\d+$/)) return u;
                        s = JSON.stringify("" + i), s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (s = s.substr(1, s.length - 2), s = e.stylize(s, "name")) : (s = s.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), s = e.stylize(s, "string")) }
                    return s + ": " + u }

                function reduceToSingleString(e, r, t) {
                    var n = 0,
                        i = e.reduce(function(e, r) {
                            return n++, r.indexOf("\n") >= 0 && n++, e + r.replace(/\u001b\[\d\d?m/g, "").length + 1 }, 0);
                    return i > 60 ? t[0] + ("" === r ? "" : r + "\n ") + " " + e.join(",\n  ") + " " + t[1] : t[0] + r + " " + e.join(", ") + " " + t[1] }

                function isArray(e) {
                    return Array.isArray(e) }

                function isBoolean(e) {
                    return "boolean" == typeof e }

                function isNull(e) {
                    return null === e }

                function isNullOrUndefined(e) {
                    return null == e }

                function isNumber(e) {
                    return "number" == typeof e }

                function isString(e) {
                    return "string" == typeof e }

                function isSymbol(e) {
                    return "symbol" == typeof e }

                function isUndefined(e) {
                    return void 0 === e }

                function isRegExp(e) {
                    return isObject(e) && "[object RegExp]" === objectToString(e) }

                function isObject(e) {
                    return "object" == typeof e && null !== e }

                function isDate(e) {
                    return isObject(e) && "[object Date]" === objectToString(e) }

                function isError(e) {
                    return isObject(e) && ("[object Error]" === objectToString(e) || e instanceof Error) }

                function isFunction(e) {
                    return "function" == typeof e }

                function isPrimitive(e) {
                    return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || "undefined" == typeof e }

                function objectToString(e) {
                    return Object.prototype.toString.call(e) }

                function pad(e) {
                    return e < 10 ? "0" + e.toString(10) : e.toString(10) }

                function timestamp() {
                    var e = new Date,
                        r = [pad(e.getHours()), pad(e.getMinutes()), pad(e.getSeconds())].join(":");
                    return [e.getDate(), months[e.getMonth()], r].join(" ") }

                function hasOwnProperty(e, r) {
                    return Object.prototype.hasOwnProperty.call(e, r) }
                var formatRegExp = /%[sdj%]/g;
                exports.format = function(e) {
                    if (!isString(e)) {
                        for (var r = [], t = 0; t < arguments.length; t++) r.push(inspect(arguments[t]));
                        return r.join(" ") }
                    for (var t = 1, n = arguments, i = n.length, o = String(e).replace(formatRegExp, function(e) {
                            if ("%%" === e) return "%";
                            if (t >= i) return e;
                            switch (e) {
                                case "%s":
                                    return String(n[t++]);
                                case "%d":
                                    return Number(n[t++]);
                                case "%j":
                                    try {
                                        return JSON.stringify(n[t++]) } catch (e) {
                                        return "[Circular]" }
                                default:
                                    return e } }), s = n[t]; t < i; s = n[++t]) o += isNull(s) || !isObject(s) ? " " + s : " " + inspect(s);
                    return o }, exports.deprecate = function(e, r) {
                    function t() {
                        if (!n) {
                            if (process.throwDeprecation) throw new Error(r);
                            process.traceDeprecation ? console.trace(r) : console.error(r), n = !0 }
                        return e.apply(this, arguments) }
                    if (isUndefined(global.process)) return function() {
                        return exports.deprecate(e, r).apply(this, arguments) };
                    if (process.noDeprecation === !0) return e;
                    var n = !1;
                    return t };
                var debugs = {},
                    debugEnviron;
                exports.debuglog = function(e) {
                    if (isUndefined(debugEnviron) && (debugEnviron = process.env.NODE_DEBUG || ""), e = e.toUpperCase(), !debugs[e])
                        if (new RegExp("\\b" + e + "\\b", "i").test(debugEnviron)) {
                            var r = process.pid;
                            debugs[e] = function() {
                                var t = exports.format.apply(exports, arguments);
                                console.error("%s %d: %s", e, r, t) } } else debugs[e] = function() {};
                    return debugs[e] }, exports.inspect = inspect, inspect.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] }, inspect.styles = { special: "cyan", number: "yellow", boolean: "yellow", undefined: "grey", null: "bold", string: "green", date: "magenta", regexp: "red" }, exports.isArray = isArray, exports.isBoolean = isBoolean, exports.isNull = isNull, exports.isNullOrUndefined = isNullOrUndefined, exports.isNumber = isNumber, exports.isString = isString, exports.isSymbol = isSymbol, exports.isUndefined = isUndefined, exports.isRegExp = isRegExp, exports.isObject = isObject, exports.isDate = isDate, exports.isError = isError, exports.isFunction = isFunction, exports.isPrimitive = isPrimitive, exports.isBuffer = require("./support/isBuffer");
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                exports.log = function() { console.log("%s - %s", timestamp(), exports.format.apply(exports, arguments)) }, exports.inherits = require("inherits"), exports._extend = function(e, r) {
                    if (!r || !isObject(r)) return e;
                    for (var t = Object.keys(r), n = t.length; n--;) e[t[n]] = r[t[n]];
                    return e };
            }).call(this, require('_process'), typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, { "./support/isBuffer": 134, "_process": 126, "inherits": 133 }],
        136: [function(require, module, exports) {
            function clamp_css_byte(e) {
                return e = Math.round(e), e < 0 ? 0 : e > 255 ? 255 : e }

            function clamp_css_float(e) {
                return e < 0 ? 0 : e > 1 ? 1 : e }

            function parse_css_int(e) {
                return clamp_css_byte("%" === e[e.length - 1] ? parseFloat(e) / 100 * 255 : parseInt(e)) }

            function parse_css_float(e) {
                return clamp_css_float("%" === e[e.length - 1] ? parseFloat(e) / 100 : parseFloat(e)) }

            function css_hue_to_rgb(e, r, l) {
                return l < 0 ? l += 1 : l > 1 && (l -= 1), 6 * l < 1 ? e + (r - e) * l * 6 : 2 * l < 1 ? r : 3 * l < 2 ? e + (r - e) * (2 / 3 - l) * 6 : e }

            function parseCSSColor(e) {
                var r = e.replace(/ /g, "").toLowerCase();
                if (r in kCSSColorTable) return kCSSColorTable[r].slice();
                if ("#" === r[0]) {
                    if (4 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && l <= 4095 ? [(3840 & l) >> 4 | (3840 & l) >> 8, 240 & l | (240 & l) >> 4, 15 & l | (15 & l) << 4, 1] : null }
                    if (7 === r.length) {
                        var l = parseInt(r.substr(1), 16);
                        return l >= 0 && l <= 16777215 ? [(16711680 & l) >> 16, (65280 & l) >> 8, 255 & l, 1] : null }
                    return null }
                var a = r.indexOf("("),
                    t = r.indexOf(")");
                if (a !== -1 && t + 1 === r.length) {
                    var n = r.substr(0, a),
                        s = r.substr(a + 1, t - (a + 1)).split(","),
                        o = 1;
                    switch (n) {
                        case "rgba":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "rgb":
                            return 3 !== s.length ? null : [parse_css_int(s[0]), parse_css_int(s[1]), parse_css_int(s[2]), o];
                        case "hsla":
                            if (4 !== s.length) return null;
                            o = parse_css_float(s.pop());
                        case "hsl":
                            if (3 !== s.length) return null;
                            var i = (parseFloat(s[0]) % 360 + 360) % 360 / 360,
                                u = parse_css_float(s[1]),
                                g = parse_css_float(s[2]),
                                d = g <= .5 ? g * (u + 1) : g + u - g * u,
                                c = 2 * g - d;
                            return [clamp_css_byte(255 * css_hue_to_rgb(c, d, i + 1 / 3)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i)), clamp_css_byte(255 * css_hue_to_rgb(c, d, i - 1 / 3)), o];
                        default:
                            return null } }
                return null }
            var kCSSColorTable = { transparent: [0, 0, 0, 0], aliceblue: [240, 248, 255, 1], antiquewhite: [250, 235, 215, 1], aqua: [0, 255, 255, 1], aquamarine: [127, 255, 212, 1], azure: [240, 255, 255, 1], beige: [245, 245, 220, 1], bisque: [255, 228, 196, 1], black: [0, 0, 0, 1], blanchedalmond: [255, 235, 205, 1], blue: [0, 0, 255, 1], blueviolet: [138, 43, 226, 1], brown: [165, 42, 42, 1], burlywood: [222, 184, 135, 1], cadetblue: [95, 158, 160, 1], chartreuse: [127, 255, 0, 1], chocolate: [210, 105, 30, 1], coral: [255, 127, 80, 1], cornflowerblue: [100, 149, 237, 1], cornsilk: [255, 248, 220, 1], crimson: [220, 20, 60, 1], cyan: [0, 255, 255, 1], darkblue: [0, 0, 139, 1], darkcyan: [0, 139, 139, 1], darkgoldenrod: [184, 134, 11, 1], darkgray: [169, 169, 169, 1], darkgreen: [0, 100, 0, 1], darkgrey: [169, 169, 169, 1], darkkhaki: [189, 183, 107, 1], darkmagenta: [139, 0, 139, 1], darkolivegreen: [85, 107, 47, 1], darkorange: [255, 140, 0, 1], darkorchid: [153, 50, 204, 1], darkred: [139, 0, 0, 1], darksalmon: [233, 150, 122, 1], darkseagreen: [143, 188, 143, 1], darkslateblue: [72, 61, 139, 1], darkslategray: [47, 79, 79, 1], darkslategrey: [47, 79, 79, 1], darkturquoise: [0, 206, 209, 1], darkviolet: [148, 0, 211, 1], deeppink: [255, 20, 147, 1], deepskyblue: [0, 191, 255, 1], dimgray: [105, 105, 105, 1], dimgrey: [105, 105, 105, 1], dodgerblue: [30, 144, 255, 1], firebrick: [178, 34, 34, 1], floralwhite: [255, 250, 240, 1], forestgreen: [34, 139, 34, 1], fuchsia: [255, 0, 255, 1], gainsboro: [220, 220, 220, 1], ghostwhite: [248, 248, 255, 1], gold: [255, 215, 0, 1], goldenrod: [218, 165, 32, 1], gray: [128, 128, 128, 1], green: [0, 128, 0, 1], greenyellow: [173, 255, 47, 1], grey: [128, 128, 128, 1], honeydew: [240, 255, 240, 1], hotpink: [255, 105, 180, 1], indianred: [205, 92, 92, 1], indigo: [75, 0, 130, 1], ivory: [255, 255, 240, 1], khaki: [240, 230, 140, 1], lavender: [230, 230, 250, 1], lavenderblush: [255, 240, 245, 1], lawngreen: [124, 252, 0, 1], lemonchiffon: [255, 250, 205, 1], lightblue: [173, 216, 230, 1], lightcoral: [240, 128, 128, 1], lightcyan: [224, 255, 255, 1], lightgoldenrodyellow: [250, 250, 210, 1], lightgray: [211, 211, 211, 1], lightgreen: [144, 238, 144, 1], lightgrey: [211, 211, 211, 1], lightpink: [255, 182, 193, 1], lightsalmon: [255, 160, 122, 1], lightseagreen: [32, 178, 170, 1], lightskyblue: [135, 206, 250, 1], lightslategray: [119, 136, 153, 1], lightslategrey: [119, 136, 153, 1], lightsteelblue: [176, 196, 222, 1], lightyellow: [255, 255, 224, 1], lime: [0, 255, 0, 1], limegreen: [50, 205, 50, 1], linen: [250, 240, 230, 1], magenta: [255, 0, 255, 1], maroon: [128, 0, 0, 1], mediumaquamarine: [102, 205, 170, 1], mediumblue: [0, 0, 205, 1], mediumorchid: [186, 85, 211, 1], mediumpurple: [147, 112, 219, 1], mediumseagreen: [60, 179, 113, 1], mediumslateblue: [123, 104, 238, 1], mediumspringgreen: [0, 250, 154, 1], mediumturquoise: [72, 209, 204, 1], mediumvioletred: [199, 21, 133, 1], midnightblue: [25, 25, 112, 1], mintcream: [245, 255, 250, 1], mistyrose: [255, 228, 225, 1], moccasin: [255, 228, 181, 1], navajowhite: [255, 222, 173, 1], navy: [0, 0, 128, 1], oldlace: [253, 245, 230, 1], olive: [128, 128, 0, 1], olivedrab: [107, 142, 35, 1], orange: [255, 165, 0, 1], orangered: [255, 69, 0, 1], orchid: [218, 112, 214, 1], palegoldenrod: [238, 232, 170, 1], palegreen: [152, 251, 152, 1], paleturquoise: [175, 238, 238, 1], palevioletred: [219, 112, 147, 1], papayawhip: [255, 239, 213, 1], peachpuff: [255, 218, 185, 1], peru: [205, 133, 63, 1], pink: [255, 192, 203, 1], plum: [221, 160, 221, 1], powderblue: [176, 224, 230, 1], purple: [128, 0, 128, 1], rebeccapurple: [102, 51, 153, 1], red: [255, 0, 0, 1], rosybrown: [188, 143, 143, 1], royalblue: [65, 105, 225, 1], saddlebrown: [139, 69, 19, 1], salmon: [250, 128, 114, 1], sandybrown: [244, 164, 96, 1], seagreen: [46, 139, 87, 1], seashell: [255, 245, 238, 1], sienna: [160, 82, 45, 1], silver: [192, 192, 192, 1], skyblue: [135, 206, 235, 1], slateblue: [106, 90, 205, 1], slategray: [112, 128, 144, 1], slategrey: [112, 128, 144, 1], snow: [255, 250, 250, 1], springgreen: [0, 255, 127, 1], steelblue: [70, 130, 180, 1], tan: [210, 180, 140, 1], teal: [0, 128, 128, 1], thistle: [216, 191, 216, 1], tomato: [255, 99, 71, 1], turquoise: [64, 224, 208, 1], violet: [238, 130, 238, 1], wheat: [245, 222, 179, 1], white: [255, 255, 255, 1], whitesmoke: [245, 245, 245, 1], yellow: [255, 255, 0, 1], yellowgreen: [154, 205, 50, 1] };
            try { exports.parseCSSColor = parseCSSColor } catch (e) {}
        }, {}],
        137: [function(require, module, exports) {
            "use strict";

            function earcut(e, n, r) { r = r || 2;
                var t = n && n.length,
                    i = t ? n[0] * r : e.length,
                    x = linkedList(e, 0, i, r, !0),
                    a = [];
                if (!x) return a;
                var o, l, u, s, v, f, y;
                if (t && (x = eliminateHoles(e, n, x, r)), e.length > 80 * r) { o = u = e[0], l = s = e[1];
                    for (var d = r; d < i; d += r) v = e[d], f = e[d + 1], v < o && (o = v), f < l && (l = f), v > u && (u = v), f > s && (s = f);
                    y = Math.max(u - o, s - l) }
                return earcutLinked(x, a, r, o, l, y), a }

            function linkedList(e, n, r, t, i) {
                var x, a;
                if (i === signedArea(e, n, r, t) > 0)
                    for (x = n; x < r; x += t) a = insertNode(x, e[x], e[x + 1], a);
                else
                    for (x = r - t; x >= n; x -= t) a = insertNode(x, e[x], e[x + 1], a);
                return a && equals(a, a.next) && (removeNode(a), a = a.next), a }

            function filterPoints(e, n) {
                if (!e) return e;
                n || (n = e);
                var r, t = e;
                do
                    if (r = !1, t.steiner || !equals(t, t.next) && 0 !== area(t.prev, t, t.next)) t = t.next;
                    else {
                        if (removeNode(t), t = n = t.prev, t === t.next) return null;
                        r = !0 }
                while (r || t !== n);
                return n }

            function earcutLinked(e, n, r, t, i, x, a) {
                if (e) {!a && x && indexCurve(e, t, i, x);
                    for (var o, l, u = e; e.prev !== e.next;)
                        if (o = e.prev, l = e.next, x ? isEarHashed(e, t, i, x) : isEar(e)) n.push(o.i / r), n.push(e.i / r), n.push(l.i / r), removeNode(e), e = l.next, u = l.next;
                        else if (e = l, e === u) { a ? 1 === a ? (e = cureLocalIntersections(e, n, r), earcutLinked(e, n, r, t, i, x, 2)) : 2 === a && splitEarcut(e, n, r, t, i, x) : earcutLinked(filterPoints(e), n, r, t, i, x, 1);
                        break } } }

            function isEar(e) {
                var n = e.prev,
                    r = e,
                    t = e.next;
                if (area(n, r, t) >= 0) return !1;
                for (var i = e.next.next; i !== e.prev;) {
                    if (pointInTriangle(n.x, n.y, r.x, r.y, t.x, t.y, i.x, i.y) && area(i.prev, i, i.next) >= 0) return !1;
                    i = i.next }
                return !0 }

            function isEarHashed(e, n, r, t) {
                var i = e.prev,
                    x = e,
                    a = e.next;
                if (area(i, x, a) >= 0) return !1;
                for (var o = i.x < x.x ? i.x < a.x ? i.x : a.x : x.x < a.x ? x.x : a.x, l = i.y < x.y ? i.y < a.y ? i.y : a.y : x.y < a.y ? x.y : a.y, u = i.x > x.x ? i.x > a.x ? i.x : a.x : x.x > a.x ? x.x : a.x, s = i.y > x.y ? i.y > a.y ? i.y : a.y : x.y > a.y ? x.y : a.y, v = zOrder(o, l, n, r, t), f = zOrder(u, s, n, r, t), y = e.nextZ; y && y.z <= f;) {
                    if (y !== e.prev && y !== e.next && pointInTriangle(i.x, i.y, x.x, x.y, a.x, a.y, y.x, y.y) && area(y.prev, y, y.next) >= 0) return !1;
                    y = y.nextZ }
                for (y = e.prevZ; y && y.z >= v;) {
                    if (y !== e.prev && y !== e.next && pointInTriangle(i.x, i.y, x.x, x.y, a.x, a.y, y.x, y.y) && area(y.prev, y, y.next) >= 0) return !1;
                    y = y.prevZ }
                return !0 }

            function cureLocalIntersections(e, n, r) {
                var t = e;
                do {
                    var i = t.prev,
                        x = t.next.next;!equals(i, x) && intersects(i, t, t.next, x) && locallyInside(i, x) && locallyInside(x, i) && (n.push(i.i / r), n.push(t.i / r), n.push(x.i / r), removeNode(t), removeNode(t.next), t = e = x), t = t.next } while (t !== e);
                return t }

            function splitEarcut(e, n, r, t, i, x) {
                var a = e;
                do {
                    for (var o = a.next.next; o !== a.prev;) {
                        if (a.i !== o.i && isValidDiagonal(a, o)) {
                            var l = splitPolygon(a, o);
                            return a = filterPoints(a, a.next), l = filterPoints(l, l.next), earcutLinked(a, n, r, t, i, x), void earcutLinked(l, n, r, t, i, x) }
                        o = o.next }
                    a = a.next } while (a !== e) }

            function eliminateHoles(e, n, r, t) {
                var i, x, a, o, l, u = [];
                for (i = 0, x = n.length; i < x; i++) a = n[i] * t, o = i < x - 1 ? n[i + 1] * t : e.length, l = linkedList(e, a, o, t, !1), l === l.next && (l.steiner = !0), u.push(getLeftmost(l));
                for (u.sort(compareX), i = 0; i < u.length; i++) eliminateHole(u[i], r), r = filterPoints(r, r.next);
                return r }

            function compareX(e, n) {
                return e.x - n.x }

            function eliminateHole(e, n) {
                if (n = findHoleBridge(e, n)) {
                    var r = splitPolygon(n, e);
                    filterPoints(r, r.next) } }

            function findHoleBridge(e, n) {
                var r, t = n,
                    i = e.x,
                    x = e.y,
                    a = -(1 / 0);
                do {
                    if (x <= t.y && x >= t.next.y) {
                        var o = t.x + (x - t.y) * (t.next.x - t.x) / (t.next.y - t.y);
                        if (o <= i && o > a) {
                            if (a = o, o === i) {
                                if (x === t.y) return t;
                                if (x === t.next.y) return t.next }
                            r = t.x < t.next.x ? t : t.next } }
                    t = t.next } while (t !== n);
                if (!r) return null;
                if (i === a) return r.prev;
                var l, u = r,
                    s = r.x,
                    v = r.y,
                    f = 1 / 0;
                for (t = r.next; t !== u;) i >= t.x && t.x >= s && pointInTriangle(x < v ? i : a, x, s, v, x < v ? a : i, x, t.x, t.y) && (l = Math.abs(x - t.y) / (i - t.x), (l < f || l === f && t.x > r.x) && locallyInside(t, e) && (r = t, f = l)), t = t.next;
                return r }

            function indexCurve(e, n, r, t) {
                var i = e;
                do null === i.z && (i.z = zOrder(i.x, i.y, n, r, t)), i.prevZ = i.prev, i.nextZ = i.next, i = i.next; while (i !== e);
                i.prevZ.nextZ = null, i.prevZ = null, sortLinked(i) }

            function sortLinked(e) {
                var n, r, t, i, x, a, o, l, u = 1;
                do {
                    for (r = e, e = null, x = null, a = 0; r;) {
                        for (a++, t = r, o = 0, n = 0; n < u && (o++, t = t.nextZ, t); n++);
                        for (l = u; o > 0 || l > 0 && t;) 0 === o ? (i = t, t = t.nextZ, l--) : 0 !== l && t ? r.z <= t.z ? (i = r, r = r.nextZ, o--) : (i = t, t = t.nextZ, l--) : (i = r, r = r.nextZ, o--), x ? x.nextZ = i : e = i, i.prevZ = x, x = i;
                        r = t }
                    x.nextZ = null, u *= 2 } while (a > 1);
                return e }

            function zOrder(e, n, r, t, i) {
                return e = 32767 * (e - r) / i, n = 32767 * (n - t) / i, e = 16711935 & (e | e << 8), e = 252645135 & (e | e << 4), e = 858993459 & (e | e << 2), e = 1431655765 & (e | e << 1), n = 16711935 & (n | n << 8), n = 252645135 & (n | n << 4), n = 858993459 & (n | n << 2), n = 1431655765 & (n | n << 1), e | n << 1 }

            function getLeftmost(e) {
                var n = e,
                    r = e;
                do n.x < r.x && (r = n), n = n.next; while (n !== e);
                return r }

            function pointInTriangle(e, n, r, t, i, x, a, o) {
                return (i - a) * (n - o) - (e - a) * (x - o) >= 0 && (e - a) * (t - o) - (r - a) * (n - o) >= 0 && (r - a) * (x - o) - (i - a) * (t - o) >= 0 }

            function isValidDiagonal(e, n) {
                return e.next.i !== n.i && e.prev.i !== n.i && !intersectsPolygon(e, n) && locallyInside(e, n) && locallyInside(n, e) && middleInside(e, n) }

            function area(e, n, r) {
                return (n.y - e.y) * (r.x - n.x) - (n.x - e.x) * (r.y - n.y) }

            function equals(e, n) {
                return e.x === n.x && e.y === n.y }

            function intersects(e, n, r, t) {
                return !!(equals(e, n) && equals(r, t) || equals(e, t) && equals(r, n)) || area(e, n, r) > 0 != area(e, n, t) > 0 && area(r, t, e) > 0 != area(r, t, n) > 0 }

            function intersectsPolygon(e, n) {
                var r = e;
                do {
                    if (r.i !== e.i && r.next.i !== e.i && r.i !== n.i && r.next.i !== n.i && intersects(r, r.next, e, n)) return !0;
                    r = r.next } while (r !== e);
                return !1 }

            function locallyInside(e, n) {
                return area(e.prev, e, e.next) < 0 ? area(e, n, e.next) >= 0 && area(e, e.prev, n) >= 0 : area(e, n, e.prev) < 0 || area(e, e.next, n) < 0 }

            function middleInside(e, n) {
                var r = e,
                    t = !1,
                    i = (e.x + n.x) / 2,
                    x = (e.y + n.y) / 2;
                do r.y > x != r.next.y > x && i < (r.next.x - r.x) * (x - r.y) / (r.next.y - r.y) + r.x && (t = !t), r = r.next; while (r !== e);
                return t }

            function splitPolygon(e, n) {
                var r = new Node(e.i, e.x, e.y),
                    t = new Node(n.i, n.x, n.y),
                    i = e.next,
                    x = n.prev;
                return e.next = n, n.prev = e, r.next = i, i.prev = r, t.next = r, r.prev = t, x.next = t, t.prev = x, t }

            function insertNode(e, n, r, t) {
                var i = new Node(e, n, r);
                return t ? (i.next = t.next, i.prev = t, t.next.prev = i, t.next = i) : (i.prev = i, i.next = i), i }

            function removeNode(e) { e.next.prev = e.prev, e.prev.next = e.next, e.prevZ && (e.prevZ.nextZ = e.nextZ), e.nextZ && (e.nextZ.prevZ = e.prevZ) }

            function Node(e, n, r) { this.i = e, this.x = n, this.y = r, this.prev = null, this.next = null, this.z = null, this.prevZ = null, this.nextZ = null, this.steiner = !1 }

            function signedArea(e, n, r, t) {
                for (var i = 0, x = n, a = r - t; x < r; x += t) i += (e[a] - e[x]) * (e[x + 1] + e[a + 1]), a = x;
                return i }
            module.exports = earcut, earcut.deviation = function(e, n, r, t) {
                var i = n && n.length,
                    x = i ? n[0] * r : e.length,
                    a = Math.abs(signedArea(e, 0, x, r));
                if (i)
                    for (var o = 0, l = n.length; o < l; o++) {
                        var u = n[o] * r,
                            s = o < l - 1 ? n[o + 1] * r : e.length;
                        a -= Math.abs(signedArea(e, u, s, r)) }
                var v = 0;
                for (o = 0; o < t.length; o += 3) {
                    var f = t[o] * r,
                        y = t[o + 1] * r,
                        d = t[o + 2] * r;
                    v += Math.abs((e[f] - e[d]) * (e[y + 1] - e[f + 1]) - (e[f] - e[y]) * (e[d + 1] - e[f + 1])) }
                return 0 === a && 0 === v ? 0 : Math.abs((v - a) / a) }, earcut.flatten = function(e) {
                for (var n = e[0][0].length, r = { vertices: [], holes: [], dimensions: n }, t = 0, i = 0; i < e.length; i++) {
                    for (var x = 0; x < e[i].length; x++)
                        for (var a = 0; a < n; a++) r.vertices.push(e[i][x][a]);
                    i > 0 && (t += e[i - 1].length, r.holes.push(t)) }
                return r };
        }, {}],
        138: [function(require, module, exports) {
            "use strict";

            function createFilter(e) {
                return new Function("f", "var p = (f && f.properties || {}); return " + compile(e)) }

            function compile(e) {
                if (!e) return "true";
                var i = e[0];
                if (e.length <= 1) return "any" === i ? "false" : "true";
                var n = "==" === i ? compileComparisonOp(e[1], e[2], "===", !1) : "!=" === i ? compileComparisonOp(e[1], e[2], "!==", !1) : "<" === i || ">" === i || "<=" === i || ">=" === i ? compileComparisonOp(e[1], e[2], i, !0) : "any" === i ? compileLogicalOp(e.slice(1), "||") : "all" === i ? compileLogicalOp(e.slice(1), "&&") : "none" === i ? compileNegation(compileLogicalOp(e.slice(1), "||")) : "in" === i ? compileInOp(e[1], e.slice(2)) : "!in" === i ? compileNegation(compileInOp(e[1], e.slice(2))) : "has" === i ? compileHasOp(e[1]) : "!has" === i ? compileNegation(compileHasOp([e[1]])) : "true";
                return "(" + n + ")" }

            function compilePropertyReference(e) {
                return "$type" === e ? "f.type" : "$id" === e ? "f.id" : "p[" + JSON.stringify(e) + "]" }

            function compileComparisonOp(e, i, n, r) {
                var o = compilePropertyReference(e),
                    t = "$type" === e ? types.indexOf(i) : JSON.stringify(i);
                return (r ? "typeof " + o + "=== typeof " + t + "&&" : "") + o + n + t }

            function compileLogicalOp(e, i) {
                return e.map(compile).join(i) }

            function compileInOp(e, i) { "$type" === e && (i = i.map(function(e) {
                    return types.indexOf(e) }));
                var n = JSON.stringify(i.sort(compare)),
                    r = compilePropertyReference(e);
                return i.length <= 200 ? n + ".indexOf(" + r + ") !== -1" : "function(v, a, i, j) {while (i <= j) { var m = (i + j) >> 1;    if (a[m] === v) return true; if (a[m] > v) j = m - 1; else i = m + 1;}return false; }(" + r + ", " + n + ",0," + (i.length - 1) + ")" }

            function compileHasOp(e) {
                return JSON.stringify(e) + " in p" }

            function compileNegation(e) {
                return "!(" + e + ")" }

            function compare(e, i) {
                return e < i ? -1 : e > i ? 1 : 0 }
            module.exports = createFilter;
            var types = ["Unknown", "Point", "LineString", "Polygon"];
        }, {}],
        139: [function(require, module, exports) {
            function rewind(r, e) {
                switch (r && r.type || null) {
                    case "FeatureCollection":
                        return r.features = r.features.map(curryOuter(rewind, e)), r;
                    case "Feature":
                        return r.geometry = rewind(r.geometry, e), r;
                    case "Polygon":
                    case "MultiPolygon":
                        return correct(r, e);
                    default:
                        return r } }

            function curryOuter(r, e) {
                return function(n) {
                    return r(n, e) } }

            function correct(r, e) {
                return "Polygon" === r.type ? r.coordinates = correctRings(r.coordinates, e) : "MultiPolygon" === r.type && (r.coordinates = r.coordinates.map(curryOuter(correctRings, e))), r }

            function correctRings(r, e) { e = !!e, r[0] = wind(r[0], !e);
                for (var n = 1; n < r.length; n++) r[n] = wind(r[n], e);
                return r }

            function wind(r, e) {
                return cw(r) === e ? r : r.reverse() }

            function cw(r) {
                return geojsonArea.ring(r) >= 0 }
            var geojsonArea = require("geojson-area");
            module.exports = rewind;
        }, { "geojson-area": 140 }],
        140: [function(require, module, exports) {
            function geometry(r) {
                if ("Polygon" === r.type) return polygonArea(r.coordinates);
                if ("MultiPolygon" === r.type) {
                    for (var e = 0, n = 0; n < r.coordinates.length; n++) e += polygonArea(r.coordinates[n]);
                    return e }
                return null }

            function polygonArea(r) {
                var e = 0;
                if (r && r.length > 0) { e += Math.abs(ringArea(r[0]));
                    for (var n = 1; n < r.length; n++) e -= Math.abs(ringArea(r[n])) }
                return e }

            function ringArea(r) {
                var e = 0;
                if (r.length > 2) {
                    for (var n, t, o = 0; o < r.length - 1; o++) n = r[o], t = r[o + 1], e += rad(t[0] - n[0]) * (2 + Math.sin(rad(n[1])) + Math.sin(rad(t[1])));
                    e = e * wgs84.RADIUS * wgs84.RADIUS / 2 }
                return e }

            function rad(r) {
                return r * Math.PI / 180 }
            var wgs84 = require("wgs84");
            module.exports.geometry = geometry, module.exports.ring = ringArea;
        }, { "wgs84": 141 }],
        141: [function(require, module, exports) {
            module.exports.RADIUS = 6378137, module.exports.FLATTENING = 1 / 298.257223563, module.exports.POLAR_RADIUS = 6356752.3142;
        }, {}],
        142: [function(require, module, exports) {
            "use strict";

            function clip(e, r, t, n, u, i, l, s) {
                if (t /= r, n /= r, l >= t && s <= n) return e;
                if (l > n || s < t) return null;
                for (var h = [], p = 0; p < e.length; p++) {
                    var a, c, o = e[p],
                        f = o.geometry,
                        g = o.type;
                    if (a = o.min[u], c = o.max[u], a >= t && c <= n) h.push(o);
                    else if (!(a > n || c < t)) {
                        var v = 1 === g ? clipPoints(f, t, n, u) : clipGeometry(f, t, n, u, i, 3 === g);
                        v.length && h.push(createFeature(o.tags, g, v, o.id)) } }
                return h.length ? h : null }

            function clipPoints(e, r, t, n) {
                for (var u = [], i = 0; i < e.length; i++) {
                    var l = e[i],
                        s = l[n];
                    s >= r && s <= t && u.push(l) }
                return u }

            function clipGeometry(e, r, t, n, u, i) {
                for (var l = [], s = 0; s < e.length; s++) {
                    var h, p, a, c = 0,
                        o = 0,
                        f = null,
                        g = e[s],
                        v = g.area,
                        m = g.dist,
                        w = g.outer,
                        S = g.length,
                        d = [];
                    for (p = 0; p < S - 1; p++) h = f || g[p], f = g[p + 1], c = o || h[n], o = f[n], c < r ? o > t ? (d.push(u(h, f, r), u(h, f, t)), i || (d = newSlice(l, d, v, m, w))) : o >= r && d.push(u(h, f, r)) : c > t ? o < r ? (d.push(u(h, f, t), u(h, f, r)), i || (d = newSlice(l, d, v, m, w))) : o <= t && d.push(u(h, f, t)) : (d.push(h), o < r ? (d.push(u(h, f, r)), i || (d = newSlice(l, d, v, m, w))) : o > t && (d.push(u(h, f, t)), i || (d = newSlice(l, d, v, m, w))));
                    h = g[S - 1], c = h[n], c >= r && c <= t && d.push(h), a = d[d.length - 1], i && a && (d[0][0] !== a[0] || d[0][1] !== a[1]) && d.push(d[0]), newSlice(l, d, v, m, w) }
                return l }

            function newSlice(e, r, t, n, u) {
                return r.length && (r.area = t, r.dist = n, void 0 !== u && (r.outer = u), e.push(r)), [] }
            module.exports = clip;
            var createFeature = require("./feature");
        }, { "./feature": 144 }],
        143: [function(require, module, exports) {
            "use strict";

            function convert(e, t) {
                var r = [];
                if ("FeatureCollection" === e.type)
                    for (var o = 0; o < e.features.length; o++) convertFeature(r, e.features[o], t);
                else "Feature" === e.type ? convertFeature(r, e, t) : convertFeature(r, { geometry: e }, t);
                return r }

            function convertFeature(e, t, r) {
                if (null !== t.geometry) {
                    var o, a, i, n, u = t.geometry,
                        c = u.type,
                        l = u.coordinates,
                        s = t.properties,
                        p = t.id;
                    if ("Point" === c) e.push(createFeature(s, 1, [projectPoint(l)], p));
                    else if ("MultiPoint" === c) e.push(createFeature(s, 1, project(l), p));
                    else if ("LineString" === c) e.push(createFeature(s, 2, [project(l, r)], p));
                    else if ("MultiLineString" === c || "Polygon" === c) {
                        for (i = [], o = 0; o < l.length; o++) n = project(l[o], r), "Polygon" === c && (n.outer = 0 === o), i.push(n);
                        e.push(createFeature(s, "Polygon" === c ? 3 : 2, i, p)) } else if ("MultiPolygon" === c) {
                        for (i = [], o = 0; o < l.length; o++)
                            for (a = 0; a < l[o].length; a++) n = project(l[o][a], r), n.outer = 0 === a, i.push(n);
                        e.push(createFeature(s, 3, i, p)) } else {
                        if ("GeometryCollection" !== c) throw new Error("Input data is not a valid GeoJSON object.");
                        for (o = 0; o < u.geometries.length; o++) convertFeature(e, { geometry: u.geometries[o], properties: s }, r) } } }

            function project(e, t) {
                for (var r = [], o = 0; o < e.length; o++) r.push(projectPoint(e[o]));
                return t && (simplify(r, t), calcSize(r)), r }

            function projectPoint(e) {
                var t = Math.sin(e[1] * Math.PI / 180),
                    r = e[0] / 360 + .5,
                    o = .5 - .25 * Math.log((1 + t) / (1 - t)) / Math.PI;
                return o = o < 0 ? 0 : o > 1 ? 1 : o, [r, o, 0] }

            function calcSize(e) {
                for (var t, r, o = 0, a = 0, i = 0; i < e.length - 1; i++) t = r || e[i], r = e[i + 1], o += t[0] * r[1] - r[0] * t[1], a += Math.abs(r[0] - t[0]) + Math.abs(r[1] - t[1]);
                e.area = Math.abs(o / 2), e.dist = a }
            module.exports = convert;
            var simplify = require("./simplify"),
                createFeature = require("./feature");
        }, { "./feature": 144, "./simplify": 146 }],
        144: [function(require, module, exports) {
            "use strict";

            function createFeature(e, t, a, n) {
                var r = { id: n || null, type: t, geometry: a, tags: e || null, min: [1 / 0, 1 / 0], max: [-(1 / 0), -(1 / 0)] };
                return calcBBox(r), r }

            function calcBBox(e) {
                var t = e.geometry,
                    a = e.min,
                    n = e.max;
                if (1 === e.type) calcRingBBox(a, n, t);
                else
                    for (var r = 0; r < t.length; r++) calcRingBBox(a, n, t[r]);
                return e }

            function calcRingBBox(e, t, a) {
                for (var n, r = 0; r < a.length; r++) n = a[r], e[0] = Math.min(n[0], e[0]), t[0] = Math.max(n[0], t[0]), e[1] = Math.min(n[1], e[1]), t[1] = Math.max(n[1], t[1]) }
            module.exports = createFeature;
        }, {}],
        145: [function(require, module, exports) {
            "use strict";

            function geojsonvt(e, t) {
                return new GeoJSONVT(e, t) }

            function GeoJSONVT(e, t) { t = this.options = extend(Object.create(this.options), t);
                var i = t.debug;
                i && console.time("preprocess data");
                var o = 1 << t.maxZoom,
                    n = convert(e, t.tolerance / (o * t.extent));
                this.tiles = {}, this.tileCoords = [], i && (console.timeEnd("preprocess data"), console.log("index: maxZoom: %d, maxPoints: %d", t.indexMaxZoom, t.indexMaxPoints), console.time("generate tiles"), this.stats = {}, this.total = 0), n = wrap(n, t.buffer / t.extent, intersectX), n.length && this.splitTile(n, 0, 0, 0), i && (n.length && console.log("features: %d, points: %d", this.tiles[0].numFeatures, this.tiles[0].numPoints), console.timeEnd("generate tiles"), console.log("tiles generated:", this.total, JSON.stringify(this.stats))) }

            function toID(e, t, i) {
                return 32 * ((1 << e) * i + t) + e }

            function intersectX(e, t, i) {
                return [i, (i - e[0]) * (t[1] - e[1]) / (t[0] - e[0]) + e[1], 1] }

            function intersectY(e, t, i) {
                return [(i - e[1]) * (t[0] - e[0]) / (t[1] - e[1]) + e[0], i, 1] }

            function extend(e, t) {
                for (var i in t) e[i] = t[i];
                return e }

            function isClippedSquare(e, t, i) {
                var o = e.source;
                if (1 !== o.length) return !1;
                var n = o[0];
                if (3 !== n.type || n.geometry.length > 1) return !1;
                var r = n.geometry[0].length;
                if (5 !== r) return !1;
                for (var s = 0; s < r; s++) {
                    var l = transform.point(n.geometry[0][s], t, e.z2, e.x, e.y);
                    if (l[0] !== -i && l[0] !== t + i || l[1] !== -i && l[1] !== t + i) return !1 }
                return !0 }
            module.exports = geojsonvt;
            var convert = require("./convert"),
                transform = require("./transform"),
                clip = require("./clip"),
                wrap = require("./wrap"),
                createTile = require("./tile");
            GeoJSONVT.prototype.options = { maxZoom: 14, indexMaxZoom: 5, indexMaxPoints: 1e5, solidChildren: !1, tolerance: 3, extent: 4096, buffer: 64, debug: 0 }, GeoJSONVT.prototype.splitTile = function(e, t, i, o, n, r, s) {
                for (var l = [e, t, i, o], a = this.options, u = a.debug, c = null; l.length;) { o = l.pop(), i = l.pop(), t = l.pop(), e = l.pop();
                    var p = 1 << t,
                        d = toID(t, i, o),
                        m = this.tiles[d],
                        f = t === a.maxZoom ? 0 : a.tolerance / (p * a.extent);
                    if (!m && (u > 1 && console.time("creation"), m = this.tiles[d] = createTile(e, p, i, o, f, t === a.maxZoom), this.tileCoords.push({ z: t, x: i, y: o }), u)) { u > 1 && (console.log("tile z%d-%d-%d (features: %d, points: %d, simplified: %d)", t, i, o, m.numFeatures, m.numPoints, m.numSimplified), console.timeEnd("creation"));
                        var h = "z" + t;
                        this.stats[h] = (this.stats[h] || 0) + 1, this.total++ }
                    if (m.source = e, n) {
                        if (t === a.maxZoom || t === n) continue;
                        var x = 1 << n - t;
                        if (i !== Math.floor(r / x) || o !== Math.floor(s / x)) continue } else if (t === a.indexMaxZoom || m.numPoints <= a.indexMaxPoints) continue;
                    if (a.solidChildren || !isClippedSquare(m, a.extent, a.buffer)) { m.source = null, u > 1 && console.time("clipping");
                        var g, v, M, T, b, y, S = .5 * a.buffer / a.extent,
                            Z = .5 - S,
                            q = .5 + S,
                            w = 1 + S;
                        g = v = M = T = null, b = clip(e, p, i - S, i + q, 0, intersectX, m.min[0], m.max[0]), y = clip(e, p, i + Z, i + w, 0, intersectX, m.min[0], m.max[0]), b && (g = clip(b, p, o - S, o + q, 1, intersectY, m.min[1], m.max[1]), v = clip(b, p, o + Z, o + w, 1, intersectY, m.min[1], m.max[1])), y && (M = clip(y, p, o - S, o + q, 1, intersectY, m.min[1], m.max[1]), T = clip(y, p, o + Z, o + w, 1, intersectY, m.min[1], m.max[1])), u > 1 && console.timeEnd("clipping"), e.length && (l.push(g || [], t + 1, 2 * i, 2 * o), l.push(v || [], t + 1, 2 * i, 2 * o + 1), l.push(M || [], t + 1, 2 * i + 1, 2 * o), l.push(T || [], t + 1, 2 * i + 1, 2 * o + 1)) } else n && (c = t) }
                return c }, GeoJSONVT.prototype.getTile = function(e, t, i) {
                var o = this.options,
                    n = o.extent,
                    r = o.debug,
                    s = 1 << e;
                t = (t % s + s) % s;
                var l = toID(e, t, i);
                if (this.tiles[l]) return transform.tile(this.tiles[l], n);
                r > 1 && console.log("drilling down to z%d-%d-%d", e, t, i);
                for (var a, u = e, c = t, p = i; !a && u > 0;) u--, c = Math.floor(c / 2), p = Math.floor(p / 2), a = this.tiles[toID(u, c, p)];
                if (!a || !a.source) return null;
                if (r > 1 && console.log("found parent tile z%d-%d-%d", u, c, p), isClippedSquare(a, n, o.buffer)) return transform.tile(a, n);
                r > 1 && console.time("drilling down");
                var d = this.splitTile(a.source, u, c, p, e, t, i);
                if (r > 1 && console.timeEnd("drilling down"), null !== d) {
                    var m = 1 << e - d;
                    l = toID(d, Math.floor(t / m), Math.floor(i / m)) }
                return this.tiles[l] ? transform.tile(this.tiles[l], n) : null };
        }, { "./clip": 142, "./convert": 143, "./tile": 147, "./transform": 148, "./wrap": 149 }],
        146: [function(require, module, exports) {
            "use strict";

            function simplify(t, i) {
                var e, p, r, s, o = i * i,
                    f = t.length,
                    u = 0,
                    n = f - 1,
                    g = [];
                for (t[u][2] = 1, t[n][2] = 1; n;) {
                    for (p = 0, e = u + 1; e < n; e++) r = getSqSegDist(t[e], t[u], t[n]), r > p && (s = e, p = r);
                    p > o ? (t[s][2] = p, g.push(u), g.push(s), u = s) : (n = g.pop(), u = g.pop()) } }

            function getSqSegDist(t, i, e) {
                var p = i[0],
                    r = i[1],
                    s = e[0],
                    o = e[1],
                    f = t[0],
                    u = t[1],
                    n = s - p,
                    g = o - r;
                if (0 !== n || 0 !== g) {
                    var l = ((f - p) * n + (u - r) * g) / (n * n + g * g);
                    l > 1 ? (p = s, r = o) : l > 0 && (p += n * l, r += g * l) }
                return n = f - p, g = u - r, n * n + g * g }
            module.exports = simplify;
        }, {}],
        147: [function(require, module, exports) {
            "use strict";

            function createTile(e, n, r, i, t, u) {
                for (var a = { features: [], numPoints: 0, numSimplified: 0, numFeatures: 0, source: null, x: r, y: i, z2: n, transformed: !1, min: [2, 1], max: [-1, 0] }, m = 0; m < e.length; m++) { a.numFeatures++, addFeature(a, e[m], t, u);
                    var s = e[m].min,
                        l = e[m].max;
                    s[0] < a.min[0] && (a.min[0] = s[0]), s[1] < a.min[1] && (a.min[1] = s[1]), l[0] > a.max[0] && (a.max[0] = l[0]), l[1] > a.max[1] && (a.max[1] = l[1]) }
                return a }

            function addFeature(e, n, r, i) {
                var t, u, a, m, s = n.geometry,
                    l = n.type,
                    o = [],
                    f = r * r;
                if (1 === l)
                    for (t = 0; t < s.length; t++) o.push(s[t]), e.numPoints++, e.numSimplified++;
                else
                    for (t = 0; t < s.length; t++)
                        if (a = s[t], i || !(2 === l && a.dist < r || 3 === l && a.area < f)) {
                            var d = [];
                            for (u = 0; u < a.length; u++) m = a[u], (i || m[2] > f) && (d.push(m), e.numSimplified++), e.numPoints++;
                            3 === l && rewind(d, a.outer), o.push(d) } else e.numPoints += a.length; if (o.length) {
                    var g = { geometry: o, type: l, tags: n.tags || null };
                    null !== n.id && (g.id = n.id), e.features.push(g) } }

            function rewind(e, n) {
                var r = signedArea(e);
                r < 0 === n && e.reverse() }

            function signedArea(e) {
                for (var n, r, i = 0, t = 0, u = e.length, a = u - 1; t < u; a = t++) n = e[t], r = e[a], i += (r[0] - n[0]) * (n[1] + r[1]);
                return i }
            module.exports = createTile;
        }, {}],
        148: [function(require, module, exports) {
            "use strict";

            function transformTile(r, t) {
                if (r.transformed) return r;
                var n, e, o, f = r.z2,
                    a = r.x,
                    s = r.y;
                for (n = 0; n < r.features.length; n++) {
                    var i = r.features[n],
                        u = i.geometry,
                        m = i.type;
                    if (1 === m)
                        for (e = 0; e < u.length; e++) u[e] = transformPoint(u[e], t, f, a, s);
                    else
                        for (e = 0; e < u.length; e++) {
                            var l = u[e];
                            for (o = 0; o < l.length; o++) l[o] = transformPoint(l[o], t, f, a, s) } }
                return r.transformed = !0, r }

            function transformPoint(r, t, n, e, o) {
                var f = Math.round(t * (r[0] * n - e)),
                    a = Math.round(t * (r[1] * n - o));
                return [f, a] }
            exports.tile = transformTile, exports.point = transformPoint;
        }, {}],
        149: [function(require, module, exports) {
            "use strict";

            function wrap(r, e, t) {
                var o = r,
                    a = clip(r, 1, -1 - e, e, 0, t, -1, 2),
                    s = clip(r, 1, 1 - e, 2 + e, 0, t, -1, 2);
                return (a || s) && (o = clip(r, 1, -e, 1 + e, 0, t, -1, 2) || [], a && (o = shiftFeatureCoords(a, 1).concat(o)), s && (o = o.concat(shiftFeatureCoords(s, -1)))), o }

            function shiftFeatureCoords(r, e) {
                for (var t = [], o = 0; o < r.length; o++) {
                    var a, s = r[o],
                        i = s.type;
                    if (1 === i) a = shiftCoords(s.geometry, e);
                    else { a = [];
                        for (var u = 0; u < s.geometry.length; u++) a.push(shiftCoords(s.geometry[u], e)) }
                    t.push(createFeature(s.tags, i, a, s.id)) }
                return t }

            function shiftCoords(r, e) {
                var t = [];
                t.area = r.area, t.dist = r.dist;
                for (var o = 0; o < r.length; o++) t.push([r[o][0] + e, r[o][1], r[o][2]]);
                return t }
            var clip = require("./clip"),
                createFeature = require("./feature");
            module.exports = wrap;
        }, { "./clip": 142, "./feature": 144 }],
        150: [function(require, module, exports) {
            exports.glMatrix = require("./gl-matrix/common.js"), exports.mat2 = require("./gl-matrix/mat2.js"), exports.mat2d = require("./gl-matrix/mat2d.js"), exports.mat3 = require("./gl-matrix/mat3.js"), exports.mat4 = require("./gl-matrix/mat4.js"), exports.quat = require("./gl-matrix/quat.js"), exports.vec2 = require("./gl-matrix/vec2.js"), exports.vec3 = require("./gl-matrix/vec3.js"), exports.vec4 = require("./gl-matrix/vec4.js");
        }, { "./gl-matrix/common.js": 151, "./gl-matrix/mat2.js": 152, "./gl-matrix/mat2d.js": 153, "./gl-matrix/mat3.js": 154, "./gl-matrix/mat4.js": 155, "./gl-matrix/quat.js": 156, "./gl-matrix/vec2.js": 157, "./gl-matrix/vec3.js": 158, "./gl-matrix/vec4.js": 159 }],
        151: [function(require, module, exports) {
            var glMatrix = {};
            glMatrix.EPSILON = 1e-6, glMatrix.ARRAY_TYPE = "undefined" != typeof Float32Array ? Float32Array : Array, glMatrix.RANDOM = Math.random, glMatrix.ENABLE_SIMD = !1, glMatrix.SIMD_AVAILABLE = glMatrix.ARRAY_TYPE === Float32Array && "SIMD" in this, glMatrix.USE_SIMD = glMatrix.ENABLE_SIMD && glMatrix.SIMD_AVAILABLE, glMatrix.setMatrixArrayType = function(a) { glMatrix.ARRAY_TYPE = a };
            var degree = Math.PI / 180;
            glMatrix.toRadian = function(a) {
                return a * degree }, glMatrix.equals = function(a, r) {
                return Math.abs(a - r) <= glMatrix.EPSILON * Math.max(1, Math.abs(a), Math.abs(r)) }, module.exports = glMatrix;
        }, {}],
        152: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2 = {};
            mat2.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t }, mat2.clone = function(t) {
                var a = new glMatrix.ARRAY_TYPE(4);
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a }, mat2.copy = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t }, mat2.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t }, mat2.fromValues = function(t, a, n, r) {
                var u = new glMatrix.ARRAY_TYPE(4);
                return u[0] = t, u[1] = a, u[2] = n, u[3] = r, u }, mat2.set = function(t, a, n, r, u) {
                return t[0] = a, t[1] = n, t[2] = r, t[3] = u, t }, mat2.transpose = function(t, a) {
                if (t === a) {
                    var n = a[1];
                    t[1] = a[2], t[2] = n } else t[0] = a[0], t[1] = a[2], t[2] = a[1], t[3] = a[3];
                return t }, mat2.invert = function(t, a) {
                var n = a[0],
                    r = a[1],
                    u = a[2],
                    e = a[3],
                    i = n * e - u * r;
                return i ? (i = 1 / i, t[0] = e * i, t[1] = -r * i, t[2] = -u * i, t[3] = n * i, t) : null }, mat2.adjoint = function(t, a) {
                var n = a[0];
                return t[0] = a[3], t[1] = -a[1], t[2] = -a[2], t[3] = n, t }, mat2.determinant = function(t) {
                return t[0] * t[3] - t[2] * t[1] }, mat2.multiply = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    e = a[2],
                    i = a[3],
                    m = n[0],
                    o = n[1],
                    c = n[2],
                    M = n[3];
                return t[0] = r * m + e * o, t[1] = u * m + i * o, t[2] = r * c + e * M, t[3] = u * c + i * M, t }, mat2.mul = mat2.multiply, mat2.rotate = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    e = a[2],
                    i = a[3],
                    m = Math.sin(n),
                    o = Math.cos(n);
                return t[0] = r * o + e * m, t[1] = u * o + i * m, t[2] = r * -m + e * o, t[3] = u * -m + i * o, t }, mat2.scale = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    e = a[2],
                    i = a[3],
                    m = n[0],
                    o = n[1];
                return t[0] = r * m, t[1] = u * m, t[2] = e * o, t[3] = i * o, t }, mat2.fromRotation = function(t, a) {
                var n = Math.sin(a),
                    r = Math.cos(a);
                return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t }, mat2.fromScaling = function(t, a) {
                return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t }, mat2.str = function(t) {
                return "mat2(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, mat2.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2)) }, mat2.LDU = function(t, a, n, r) {
                return t[2] = r[2] / r[0], n[0] = r[0], n[1] = r[1], n[3] = r[3] - t[2] * n[1], [t, a, n] }, mat2.add = function(t, a, n) {
                return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t }, mat2.subtract = function(t, a, n) {
                return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t }, mat2.sub = mat2.subtract, mat2.exactEquals = function(t, a) {
                return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] }, mat2.equals = function(t, a) {
                var n = t[0],
                    r = t[1],
                    u = t[2],
                    e = t[3],
                    i = a[0],
                    m = a[1],
                    o = a[2],
                    c = a[3];
                return Math.abs(n - i) <= glMatrix.EPSILON * Math.max(1, Math.abs(n), Math.abs(i)) && Math.abs(r - m) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(m)) && Math.abs(u - o) <= glMatrix.EPSILON * Math.max(1, Math.abs(u), Math.abs(o)) && Math.abs(e - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(c)) }, mat2.multiplyScalar = function(t, a, n) {
                return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t }, mat2.multiplyScalarAndAdd = function(t, a, n, r) {
                return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t }, module.exports = mat2;
        }, { "./common.js": 151 }],
        153: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat2d = {};
            mat2d.create = function() {
                var t = new glMatrix.ARRAY_TYPE(6);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t }, mat2d.clone = function(t) {
                var a = new glMatrix.ARRAY_TYPE(6);
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a }, mat2d.copy = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t }, mat2d.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = 0, t[5] = 0, t }, mat2d.fromValues = function(t, a, n, r, u, m) {
                var i = new glMatrix.ARRAY_TYPE(6);
                return i[0] = t, i[1] = a, i[2] = n, i[3] = r, i[4] = u, i[5] = m, i }, mat2d.set = function(t, a, n, r, u, m, i) {
                return t[0] = a, t[1] = n, t[2] = r, t[3] = u, t[4] = m, t[5] = i, t }, mat2d.invert = function(t, a) {
                var n = a[0],
                    r = a[1],
                    u = a[2],
                    m = a[3],
                    i = a[4],
                    o = a[5],
                    M = n * m - r * u;
                return M ? (M = 1 / M, t[0] = m * M, t[1] = -r * M, t[2] = -u * M, t[3] = n * M, t[4] = (u * o - m * i) * M, t[5] = (r * i - n * o) * M, t) : null }, mat2d.determinant = function(t) {
                return t[0] * t[3] - t[1] * t[2] }, mat2d.multiply = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    m = a[2],
                    i = a[3],
                    o = a[4],
                    M = a[5],
                    e = n[0],
                    d = n[1],
                    c = n[2],
                    s = n[3],
                    h = n[4],
                    l = n[5];
                return t[0] = r * e + m * d, t[1] = u * e + i * d, t[2] = r * c + m * s, t[3] = u * c + i * s, t[4] = r * h + m * l + o, t[5] = u * h + i * l + M, t }, mat2d.mul = mat2d.multiply, mat2d.rotate = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    m = a[2],
                    i = a[3],
                    o = a[4],
                    M = a[5],
                    e = Math.sin(n),
                    d = Math.cos(n);
                return t[0] = r * d + m * e, t[1] = u * d + i * e, t[2] = r * -e + m * d, t[3] = u * -e + i * d, t[4] = o, t[5] = M, t }, mat2d.scale = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    m = a[2],
                    i = a[3],
                    o = a[4],
                    M = a[5],
                    e = n[0],
                    d = n[1];
                return t[0] = r * e, t[1] = u * e, t[2] = m * d, t[3] = i * d, t[4] = o, t[5] = M, t }, mat2d.translate = function(t, a, n) {
                var r = a[0],
                    u = a[1],
                    m = a[2],
                    i = a[3],
                    o = a[4],
                    M = a[5],
                    e = n[0],
                    d = n[1];
                return t[0] = r, t[1] = u, t[2] = m, t[3] = i, t[4] = r * e + m * d + o, t[5] = u * e + i * d + M, t }, mat2d.fromRotation = function(t, a) {
                var n = Math.sin(a),
                    r = Math.cos(a);
                return t[0] = r, t[1] = n, t[2] = -n, t[3] = r, t[4] = 0, t[5] = 0, t }, mat2d.fromScaling = function(t, a) {
                return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = a[1], t[4] = 0, t[5] = 0, t }, mat2d.fromTranslation = function(t, a) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 1, t[4] = a[0], t[5] = a[1], t }, mat2d.str = function(t) {
                return "mat2d(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ")" }, mat2d.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + 1) }, mat2d.add = function(t, a, n) {
                return t[0] = a[0] + n[0], t[1] = a[1] + n[1], t[2] = a[2] + n[2], t[3] = a[3] + n[3], t[4] = a[4] + n[4], t[5] = a[5] + n[5], t }, mat2d.subtract = function(t, a, n) {
                return t[0] = a[0] - n[0], t[1] = a[1] - n[1], t[2] = a[2] - n[2], t[3] = a[3] - n[3], t[4] = a[4] - n[4], t[5] = a[5] - n[5], t }, mat2d.sub = mat2d.subtract, mat2d.multiplyScalar = function(t, a, n) {
                return t[0] = a[0] * n, t[1] = a[1] * n, t[2] = a[2] * n, t[3] = a[3] * n, t[4] = a[4] * n, t[5] = a[5] * n, t }, mat2d.multiplyScalarAndAdd = function(t, a, n, r) {
                return t[0] = a[0] + n[0] * r, t[1] = a[1] + n[1] * r, t[2] = a[2] + n[2] * r, t[3] = a[3] + n[3] * r, t[4] = a[4] + n[4] * r, t[5] = a[5] + n[5] * r, t }, mat2d.exactEquals = function(t, a) {
                return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] && t[4] === a[4] && t[5] === a[5] }, mat2d.equals = function(t, a) {
                var n = t[0],
                    r = t[1],
                    u = t[2],
                    m = t[3],
                    i = t[4],
                    o = t[5],
                    M = a[0],
                    e = a[1],
                    d = a[2],
                    c = a[3],
                    s = a[4],
                    h = a[5];
                return Math.abs(n - M) <= glMatrix.EPSILON * Math.max(1, Math.abs(n), Math.abs(M)) && Math.abs(r - e) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(e)) && Math.abs(u - d) <= glMatrix.EPSILON * Math.max(1, Math.abs(u), Math.abs(d)) && Math.abs(m - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(m), Math.abs(c)) && Math.abs(i - s) <= glMatrix.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(o - h) <= glMatrix.EPSILON * Math.max(1, Math.abs(o), Math.abs(h)) }, module.exports = mat2d;
        }, { "./common.js": 151 }],
        154: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = {};
            mat3.create = function() {
                var t = new glMatrix.ARRAY_TYPE(9);
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, mat3.fromMat4 = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[4], t[4] = a[5], t[5] = a[6], t[6] = a[8], t[7] = a[9], t[8] = a[10], t }, mat3.clone = function(t) {
                var a = new glMatrix.ARRAY_TYPE(9);
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a }, mat3.copy = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t }, mat3.fromValues = function(t, a, r, n, u, M, m, o, i) {
                var e = new glMatrix.ARRAY_TYPE(9);
                return e[0] = t, e[1] = a, e[2] = r, e[3] = n, e[4] = u, e[5] = M, e[6] = m, e[7] = o, e[8] = i, e }, mat3.set = function(t, a, r, n, u, M, m, o, i, e) {
                return t[0] = a, t[1] = r, t[2] = n, t[3] = u, t[4] = M, t[5] = m, t[6] = o, t[7] = i, t[8] = e, t }, mat3.identity = function(t) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, mat3.transpose = function(t, a) {
                if (t === a) {
                    var r = a[1],
                        n = a[2],
                        u = a[5];
                    t[1] = a[3], t[2] = a[6], t[3] = r, t[5] = a[7], t[6] = n, t[7] = u } else t[0] = a[0], t[1] = a[3], t[2] = a[6], t[3] = a[1], t[4] = a[4], t[5] = a[7], t[6] = a[2], t[7] = a[5], t[8] = a[8];
                return t }, mat3.invert = function(t, a) {
                var r = a[0],
                    n = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[4],
                    o = a[5],
                    i = a[6],
                    e = a[7],
                    h = a[8],
                    s = h * m - o * e,
                    c = -h * M + o * i,
                    l = e * M - m * i,
                    f = r * s + n * c + u * l;
                return f ? (f = 1 / f, t[0] = s * f, t[1] = (-h * n + u * e) * f, t[2] = (o * n - u * m) * f, t[3] = c * f, t[4] = (h * r - u * i) * f, t[5] = (-o * r + u * M) * f, t[6] = l * f, t[7] = (-e * r + n * i) * f, t[8] = (m * r - n * M) * f, t) : null }, mat3.adjoint = function(t, a) {
                var r = a[0],
                    n = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[4],
                    o = a[5],
                    i = a[6],
                    e = a[7],
                    h = a[8];
                return t[0] = m * h - o * e, t[1] = u * e - n * h, t[2] = n * o - u * m, t[3] = o * i - M * h, t[4] = r * h - u * i, t[5] = u * M - r * o, t[6] = M * e - m * i, t[7] = n * i - r * e, t[8] = r * m - n * M, t }, mat3.determinant = function(t) {
                var a = t[0],
                    r = t[1],
                    n = t[2],
                    u = t[3],
                    M = t[4],
                    m = t[5],
                    o = t[6],
                    i = t[7],
                    e = t[8];
                return a * (e * M - m * i) + r * (-e * u + m * o) + n * (i * u - M * o) }, mat3.multiply = function(t, a, r) {
                var n = a[0],
                    u = a[1],
                    M = a[2],
                    m = a[3],
                    o = a[4],
                    i = a[5],
                    e = a[6],
                    h = a[7],
                    s = a[8],
                    c = r[0],
                    l = r[1],
                    f = r[2],
                    b = r[3],
                    x = r[4],
                    v = r[5],
                    p = r[6],
                    g = r[7],
                    E = r[8];
                return t[0] = c * n + l * m + f * e, t[1] = c * u + l * o + f * h, t[2] = c * M + l * i + f * s, t[3] = b * n + x * m + v * e, t[4] = b * u + x * o + v * h, t[5] = b * M + x * i + v * s, t[6] = p * n + g * m + E * e, t[7] = p * u + g * o + E * h, t[8] = p * M + g * i + E * s, t }, mat3.mul = mat3.multiply, mat3.translate = function(t, a, r) {
                var n = a[0],
                    u = a[1],
                    M = a[2],
                    m = a[3],
                    o = a[4],
                    i = a[5],
                    e = a[6],
                    h = a[7],
                    s = a[8],
                    c = r[0],
                    l = r[1];
                return t[0] = n, t[1] = u, t[2] = M, t[3] = m, t[4] = o, t[5] = i, t[6] = c * n + l * m + e, t[7] = c * u + l * o + h, t[8] = c * M + l * i + s, t }, mat3.rotate = function(t, a, r) {
                var n = a[0],
                    u = a[1],
                    M = a[2],
                    m = a[3],
                    o = a[4],
                    i = a[5],
                    e = a[6],
                    h = a[7],
                    s = a[8],
                    c = Math.sin(r),
                    l = Math.cos(r);
                return t[0] = l * n + c * m, t[1] = l * u + c * o, t[2] = l * M + c * i, t[3] = l * m - c * n, t[4] = l * o - c * u, t[5] = l * i - c * M, t[6] = e, t[7] = h, t[8] = s, t }, mat3.scale = function(t, a, r) {
                var n = r[0],
                    u = r[1];
                return t[0] = n * a[0], t[1] = n * a[1], t[2] = n * a[2], t[3] = u * a[3], t[4] = u * a[4], t[5] = u * a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t }, mat3.fromTranslation = function(t, a) {
                return t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 1, t[5] = 0, t[6] = a[0], t[7] = a[1], t[8] = 1, t }, mat3.fromRotation = function(t, a) {
                var r = Math.sin(a),
                    n = Math.cos(a);
                return t[0] = n, t[1] = r, t[2] = 0, t[3] = -r, t[4] = n, t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, mat3.fromScaling = function(t, a) {
                return t[0] = a[0], t[1] = 0, t[2] = 0, t[3] = 0, t[4] = a[1], t[5] = 0, t[6] = 0, t[7] = 0, t[8] = 1, t }, mat3.fromMat2d = function(t, a) {
                return t[0] = a[0], t[1] = a[1], t[2] = 0, t[3] = a[2], t[4] = a[3], t[5] = 0, t[6] = a[4], t[7] = a[5], t[8] = 1, t }, mat3.fromQuat = function(t, a) {
                var r = a[0],
                    n = a[1],
                    u = a[2],
                    M = a[3],
                    m = r + r,
                    o = n + n,
                    i = u + u,
                    e = r * m,
                    h = n * m,
                    s = n * o,
                    c = u * m,
                    l = u * o,
                    f = u * i,
                    b = M * m,
                    x = M * o,
                    v = M * i;
                return t[0] = 1 - s - f, t[3] = h - v, t[6] = c + x, t[1] = h + v, t[4] = 1 - e - f, t[7] = l - b, t[2] = c - x, t[5] = l + b, t[8] = 1 - e - s, t }, mat3.normalFromMat4 = function(t, a) {
                var r = a[0],
                    n = a[1],
                    u = a[2],
                    M = a[3],
                    m = a[4],
                    o = a[5],
                    i = a[6],
                    e = a[7],
                    h = a[8],
                    s = a[9],
                    c = a[10],
                    l = a[11],
                    f = a[12],
                    b = a[13],
                    x = a[14],
                    v = a[15],
                    p = r * o - n * m,
                    g = r * i - u * m,
                    E = r * e - M * m,
                    w = n * i - u * o,
                    P = n * e - M * o,
                    S = u * e - M * i,
                    d = h * b - s * f,
                    I = h * x - c * f,
                    L = h * v - l * f,
                    N = s * x - c * b,
                    O = s * v - l * b,
                    A = c * v - l * x,
                    R = p * A - g * O + E * N + w * L - P * I + S * d;
                return R ? (R = 1 / R, t[0] = (o * A - i * O + e * N) * R, t[1] = (i * L - m * A - e * I) * R, t[2] = (m * O - o * L + e * d) * R, t[3] = (u * O - n * A - M * N) * R, t[4] = (r * A - u * L + M * I) * R, t[5] = (n * L - r * O - M * d) * R, t[6] = (b * S - x * P + v * w) * R, t[7] = (x * E - f * S - v * g) * R, t[8] = (f * P - b * E + v * p) * R, t) : null }, mat3.str = function(t) {
                return "mat3(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ", " + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ", " + t[8] + ")" }, mat3.frob = function(t) {
                return Math.sqrt(Math.pow(t[0], 2) + Math.pow(t[1], 2) + Math.pow(t[2], 2) + Math.pow(t[3], 2) + Math.pow(t[4], 2) + Math.pow(t[5], 2) + Math.pow(t[6], 2) + Math.pow(t[7], 2) + Math.pow(t[8], 2)) }, mat3.add = function(t, a, r) {
                return t[0] = a[0] + r[0], t[1] = a[1] + r[1], t[2] = a[2] + r[2], t[3] = a[3] + r[3], t[4] = a[4] + r[4], t[5] = a[5] + r[5], t[6] = a[6] + r[6], t[7] = a[7] + r[7], t[8] = a[8] + r[8], t }, mat3.subtract = function(t, a, r) {
                return t[0] = a[0] - r[0], t[1] = a[1] - r[1], t[2] = a[2] - r[2], t[3] = a[3] - r[3], t[4] = a[4] - r[4], t[5] = a[5] - r[5], t[6] = a[6] - r[6], t[7] = a[7] - r[7], t[8] = a[8] - r[8], t }, mat3.sub = mat3.subtract, mat3.multiplyScalar = function(t, a, r) {
                return t[0] = a[0] * r, t[1] = a[1] * r, t[2] = a[2] * r, t[3] = a[3] * r, t[4] = a[4] * r, t[5] = a[5] * r, t[6] = a[6] * r, t[7] = a[7] * r, t[8] = a[8] * r, t }, mat3.multiplyScalarAndAdd = function(t, a, r, n) {
                return t[0] = a[0] + r[0] * n, t[1] = a[1] + r[1] * n, t[2] = a[2] + r[2] * n, t[3] = a[3] + r[3] * n, t[4] = a[4] + r[4] * n, t[5] = a[5] + r[5] * n, t[6] = a[6] + r[6] * n, t[7] = a[7] + r[7] * n, t[8] = a[8] + r[8] * n, t }, mat3.exactEquals = function(t, a) {
                return t[0] === a[0] && t[1] === a[1] && t[2] === a[2] && t[3] === a[3] && t[4] === a[4] && t[5] === a[5] && t[6] === a[6] && t[7] === a[7] && t[8] === a[8] }, mat3.equals = function(t, a) {
                var r = t[0],
                    n = t[1],
                    u = t[2],
                    M = t[3],
                    m = t[4],
                    o = t[5],
                    i = t[6],
                    e = t[7],
                    h = t[8],
                    s = a[0],
                    c = a[1],
                    l = a[2],
                    f = a[3],
                    b = a[4],
                    x = a[5],
                    v = t[6],
                    p = a[7],
                    g = a[8];
                return Math.abs(r - s) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(s)) && Math.abs(n - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(n), Math.abs(c)) && Math.abs(u - l) <= glMatrix.EPSILON * Math.max(1, Math.abs(u), Math.abs(l)) && Math.abs(M - f) <= glMatrix.EPSILON * Math.max(1, Math.abs(M), Math.abs(f)) && Math.abs(m - b) <= glMatrix.EPSILON * Math.max(1, Math.abs(m), Math.abs(b)) && Math.abs(o - x) <= glMatrix.EPSILON * Math.max(1, Math.abs(o), Math.abs(x)) && Math.abs(i - v) <= glMatrix.EPSILON * Math.max(1, Math.abs(i), Math.abs(v)) && Math.abs(e - p) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(p)) && Math.abs(h - g) <= glMatrix.EPSILON * Math.max(1, Math.abs(h), Math.abs(g)) }, module.exports = mat3;
        }, { "./common.js": 151 }],
        155: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat4 = { scalar: {}, SIMD: {} };
            mat4.create = function() {
                var a = new glMatrix.ARRAY_TYPE(16);
                return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.clone = function(a) {
                var t = new glMatrix.ARRAY_TYPE(16);
                return t[0] = a[0], t[1] = a[1], t[2] = a[2], t[3] = a[3], t[4] = a[4], t[5] = a[5], t[6] = a[6], t[7] = a[7], t[8] = a[8], t[9] = a[9], t[10] = a[10], t[11] = a[11], t[12] = a[12], t[13] = a[13], t[14] = a[14], t[15] = a[15], t }, mat4.copy = function(a, t) {
                return a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a }, mat4.fromValues = function(a, t, l, o, M, S, x, I, D, F, r, s, u, e, m, n) {
                var i = new glMatrix.ARRAY_TYPE(16);
                return i[0] = a, i[1] = t, i[2] = l, i[3] = o, i[4] = M, i[5] = S, i[6] = x, i[7] = I, i[8] = D, i[9] = F, i[10] = r, i[11] = s, i[12] = u, i[13] = e, i[14] = m, i[15] = n, i }, mat4.set = function(a, t, l, o, M, S, x, I, D, F, r, s, u, e, m, n, i) {
                return a[0] = t, a[1] = l, a[2] = o, a[3] = M, a[4] = S, a[5] = x, a[6] = I, a[7] = D, a[8] = F, a[9] = r, a[10] = s, a[11] = u, a[12] = e, a[13] = m, a[14] = n, a[15] = i, a }, mat4.identity = function(a) {
                return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.scalar.transpose = function(a, t) {
                if (a === t) {
                    var l = t[1],
                        o = t[2],
                        M = t[3],
                        S = t[6],
                        x = t[7],
                        I = t[11];
                    a[1] = t[4], a[2] = t[8], a[3] = t[12], a[4] = l, a[6] = t[9], a[7] = t[13], a[8] = o, a[9] = S, a[11] = t[14], a[12] = M, a[13] = x, a[14] = I } else a[0] = t[0], a[1] = t[4], a[2] = t[8], a[3] = t[12], a[4] = t[1], a[5] = t[5], a[6] = t[9], a[7] = t[13], a[8] = t[2], a[9] = t[6], a[10] = t[10], a[11] = t[14], a[12] = t[3], a[13] = t[7], a[14] = t[11], a[15] = t[15];
                return a }, mat4.SIMD.transpose = function(a, t) {
                var l, o, M, S, x, I, D, F, r, s;
                return l = SIMD.Float32x4.load(t, 0), o = SIMD.Float32x4.load(t, 4), M = SIMD.Float32x4.load(t, 8), S = SIMD.Float32x4.load(t, 12), x = SIMD.Float32x4.shuffle(l, o, 0, 1, 4, 5), I = SIMD.Float32x4.shuffle(M, S, 0, 1, 4, 5), D = SIMD.Float32x4.shuffle(x, I, 0, 2, 4, 6), F = SIMD.Float32x4.shuffle(x, I, 1, 3, 5, 7), SIMD.Float32x4.store(a, 0, D), SIMD.Float32x4.store(a, 4, F), x = SIMD.Float32x4.shuffle(l, o, 2, 3, 6, 7), I = SIMD.Float32x4.shuffle(M, S, 2, 3, 6, 7), r = SIMD.Float32x4.shuffle(x, I, 0, 2, 4, 6), s = SIMD.Float32x4.shuffle(x, I, 1, 3, 5, 7), SIMD.Float32x4.store(a, 8, r), SIMD.Float32x4.store(a, 12, s), a }, mat4.transpose = glMatrix.USE_SIMD ? mat4.SIMD.transpose : mat4.scalar.transpose, mat4.scalar.invert = function(a, t) {
                var l = t[0],
                    o = t[1],
                    M = t[2],
                    S = t[3],
                    x = t[4],
                    I = t[5],
                    D = t[6],
                    F = t[7],
                    r = t[8],
                    s = t[9],
                    u = t[10],
                    e = t[11],
                    m = t[12],
                    n = t[13],
                    i = t[14],
                    h = t[15],
                    d = l * I - o * x,
                    z = l * D - M * x,
                    f = l * F - S * x,
                    c = o * D - M * I,
                    b = o * F - S * I,
                    w = M * F - S * D,
                    v = r * n - s * m,
                    p = r * i - u * m,
                    g = r * h - e * m,
                    E = s * i - u * n,
                    P = s * h - e * n,
                    O = u * h - e * i,
                    L = d * O - z * P + f * E + c * g - b * p + w * v;
                return L ? (L = 1 / L, a[0] = (I * O - D * P + F * E) * L, a[1] = (M * P - o * O - S * E) * L, a[2] = (n * w - i * b + h * c) * L, a[3] = (u * b - s * w - e * c) * L, a[4] = (D * g - x * O - F * p) * L, a[5] = (l * O - M * g + S * p) * L, a[6] = (i * f - m * w - h * z) * L, a[7] = (r * w - u * f + e * z) * L, a[8] = (x * P - I * g + F * v) * L, a[9] = (o * g - l * P - S * v) * L, a[10] = (m * b - n * f + h * d) * L, a[11] = (s * f - r * b - e * d) * L, a[12] = (I * p - x * E - D * v) * L, a[13] = (l * E - o * p + M * v) * L, a[14] = (n * z - m * c - i * d) * L, a[15] = (r * c - s * z + u * d) * L, a) : null }, mat4.SIMD.invert = function(a, t) {
                var l, o, M, S, x, I, D, F, r, s, u = SIMD.Float32x4.load(t, 0),
                    e = SIMD.Float32x4.load(t, 4),
                    m = SIMD.Float32x4.load(t, 8),
                    n = SIMD.Float32x4.load(t, 12);
                return x = SIMD.Float32x4.shuffle(u, e, 0, 1, 4, 5), o = SIMD.Float32x4.shuffle(m, n, 0, 1, 4, 5), l = SIMD.Float32x4.shuffle(x, o, 0, 2, 4, 6), o = SIMD.Float32x4.shuffle(o, x, 1, 3, 5, 7), x = SIMD.Float32x4.shuffle(u, e, 2, 3, 6, 7), S = SIMD.Float32x4.shuffle(m, n, 2, 3, 6, 7), M = SIMD.Float32x4.shuffle(x, S, 0, 2, 4, 6), S = SIMD.Float32x4.shuffle(S, x, 1, 3, 5, 7), x = SIMD.Float32x4.mul(M, S), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), I = SIMD.Float32x4.mul(o, x), D = SIMD.Float32x4.mul(l, x), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), I = SIMD.Float32x4.sub(SIMD.Float32x4.mul(o, x), I), D = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, x), D), D = SIMD.Float32x4.swizzle(D, 2, 3, 0, 1), x = SIMD.Float32x4.mul(o, M), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), I = SIMD.Float32x4.add(SIMD.Float32x4.mul(S, x), I), r = SIMD.Float32x4.mul(l, x), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(S, x)), r = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, x), r), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), x = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(o, 2, 3, 0, 1), S), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), M = SIMD.Float32x4.swizzle(M, 2, 3, 0, 1), I = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, x), I), F = SIMD.Float32x4.mul(l, x), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), I = SIMD.Float32x4.sub(I, SIMD.Float32x4.mul(M, x)), F = SIMD.Float32x4.sub(SIMD.Float32x4.mul(l, x), F), F = SIMD.Float32x4.swizzle(F, 2, 3, 0, 1), x = SIMD.Float32x4.mul(l, o), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), F = SIMD.Float32x4.add(SIMD.Float32x4.mul(S, x), F), r = SIMD.Float32x4.sub(SIMD.Float32x4.mul(M, x), r), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), F = SIMD.Float32x4.sub(SIMD.Float32x4.mul(S, x), F), r = SIMD.Float32x4.sub(r, SIMD.Float32x4.mul(M, x)), x = SIMD.Float32x4.mul(l, S), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), D = SIMD.Float32x4.sub(D, SIMD.Float32x4.mul(M, x)), F = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, x), F), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), D = SIMD.Float32x4.add(SIMD.Float32x4.mul(M, x), D), F = SIMD.Float32x4.sub(F, SIMD.Float32x4.mul(o, x)), x = SIMD.Float32x4.mul(l, M), x = SIMD.Float32x4.swizzle(x, 1, 0, 3, 2), D = SIMD.Float32x4.add(SIMD.Float32x4.mul(S, x), D), r = SIMD.Float32x4.sub(r, SIMD.Float32x4.mul(o, x)), x = SIMD.Float32x4.swizzle(x, 2, 3, 0, 1), D = SIMD.Float32x4.sub(D, SIMD.Float32x4.mul(S, x)), r = SIMD.Float32x4.add(SIMD.Float32x4.mul(o, x), r), s = SIMD.Float32x4.mul(l, I), s = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(s, 2, 3, 0, 1), s), s = SIMD.Float32x4.add(SIMD.Float32x4.swizzle(s, 1, 0, 3, 2), s), x = SIMD.Float32x4.reciprocalApproximation(s), s = SIMD.Float32x4.sub(SIMD.Float32x4.add(x, x), SIMD.Float32x4.mul(s, SIMD.Float32x4.mul(x, x))), (s = SIMD.Float32x4.swizzle(s, 0, 0, 0, 0)) ? (SIMD.Float32x4.store(a, 0, SIMD.Float32x4.mul(s, I)), SIMD.Float32x4.store(a, 4, SIMD.Float32x4.mul(s, D)), SIMD.Float32x4.store(a, 8, SIMD.Float32x4.mul(s, F)), SIMD.Float32x4.store(a, 12, SIMD.Float32x4.mul(s, r)), a) : null }, mat4.invert = glMatrix.USE_SIMD ? mat4.SIMD.invert : mat4.scalar.invert, mat4.scalar.adjoint = function(a, t) {
                var l = t[0],
                    o = t[1],
                    M = t[2],
                    S = t[3],
                    x = t[4],
                    I = t[5],
                    D = t[6],
                    F = t[7],
                    r = t[8],
                    s = t[9],
                    u = t[10],
                    e = t[11],
                    m = t[12],
                    n = t[13],
                    i = t[14],
                    h = t[15];
                return a[0] = I * (u * h - e * i) - s * (D * h - F * i) + n * (D * e - F * u), a[1] = -(o * (u * h - e * i) - s * (M * h - S * i) + n * (M * e - S * u)), a[2] = o * (D * h - F * i) - I * (M * h - S * i) + n * (M * F - S * D), a[3] = -(o * (D * e - F * u) - I * (M * e - S * u) + s * (M * F - S * D)), a[4] = -(x * (u * h - e * i) - r * (D * h - F * i) + m * (D * e - F * u)), a[5] = l * (u * h - e * i) - r * (M * h - S * i) + m * (M * e - S * u), a[6] = -(l * (D * h - F * i) - x * (M * h - S * i) + m * (M * F - S * D)), a[7] = l * (D * e - F * u) - x * (M * e - S * u) + r * (M * F - S * D), a[8] = x * (s * h - e * n) - r * (I * h - F * n) + m * (I * e - F * s), a[9] = -(l * (s * h - e * n) - r * (o * h - S * n) + m * (o * e - S * s)), a[10] = l * (I * h - F * n) - x * (o * h - S * n) + m * (o * F - S * I), a[11] = -(l * (I * e - F * s) - x * (o * e - S * s) + r * (o * F - S * I)), a[12] = -(x * (s * i - u * n) - r * (I * i - D * n) + m * (I * u - D * s)), a[13] = l * (s * i - u * n) - r * (o * i - M * n) + m * (o * u - M * s), a[14] = -(l * (I * i - D * n) - x * (o * i - M * n) + m * (o * D - M * I)), a[15] = l * (I * u - D * s) - x * (o * u - M * s) + r * (o * D - M * I), a }, mat4.SIMD.adjoint = function(a, t) {
                var l, o, M, S, x, I, D, F, r, s, u, e, m, l = SIMD.Float32x4.load(t, 0),
                    o = SIMD.Float32x4.load(t, 4),
                    M = SIMD.Float32x4.load(t, 8),
                    S = SIMD.Float32x4.load(t, 12);
                return r = SIMD.Float32x4.shuffle(l, o, 0, 1, 4, 5), I = SIMD.Float32x4.shuffle(M, S, 0, 1, 4, 5), x = SIMD.Float32x4.shuffle(r, I, 0, 2, 4, 6), I = SIMD.Float32x4.shuffle(I, r, 1, 3, 5, 7), r = SIMD.Float32x4.shuffle(l, o, 2, 3, 6, 7), F = SIMD.Float32x4.shuffle(M, S, 2, 3, 6, 7), D = SIMD.Float32x4.shuffle(r, F, 0, 2, 4, 6), F = SIMD.Float32x4.shuffle(F, r, 1, 3, 5, 7), r = SIMD.Float32x4.mul(D, F), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), s = SIMD.Float32x4.mul(I, r), u = SIMD.Float32x4.mul(x, r), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), s = SIMD.Float32x4.sub(SIMD.Float32x4.mul(I, r), s), u = SIMD.Float32x4.sub(SIMD.Float32x4.mul(x, r), u), u = SIMD.Float32x4.swizzle(u, 2, 3, 0, 1), r = SIMD.Float32x4.mul(I, D), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(F, r), s), m = SIMD.Float32x4.mul(x, r), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(F, r)), m = SIMD.Float32x4.sub(SIMD.Float32x4.mul(x, r), m), m = SIMD.Float32x4.swizzle(m, 2, 3, 0, 1), r = SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I, 2, 3, 0, 1), F), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), D = SIMD.Float32x4.swizzle(D, 2, 3, 0, 1), s = SIMD.Float32x4.add(SIMD.Float32x4.mul(D, r), s), e = SIMD.Float32x4.mul(x, r), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), s = SIMD.Float32x4.sub(s, SIMD.Float32x4.mul(D, r)), e = SIMD.Float32x4.sub(SIMD.Float32x4.mul(x, r), e), e = SIMD.Float32x4.swizzle(e, 2, 3, 0, 1), r = SIMD.Float32x4.mul(x, I), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(F, r), e), m = SIMD.Float32x4.sub(SIMD.Float32x4.mul(D, r), m), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), e = SIMD.Float32x4.sub(SIMD.Float32x4.mul(F, r), e), m = SIMD.Float32x4.sub(m, SIMD.Float32x4.mul(D, r)), r = SIMD.Float32x4.mul(x, F), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(D, r)), e = SIMD.Float32x4.add(SIMD.Float32x4.mul(I, r), e), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(D, r), u), e = SIMD.Float32x4.sub(e, SIMD.Float32x4.mul(I, r)), r = SIMD.Float32x4.mul(x, D), r = SIMD.Float32x4.swizzle(r, 1, 0, 3, 2), u = SIMD.Float32x4.add(SIMD.Float32x4.mul(F, r), u), m = SIMD.Float32x4.sub(m, SIMD.Float32x4.mul(I, r)), r = SIMD.Float32x4.swizzle(r, 2, 3, 0, 1), u = SIMD.Float32x4.sub(u, SIMD.Float32x4.mul(F, r)), m = SIMD.Float32x4.add(SIMD.Float32x4.mul(I, r), m), SIMD.Float32x4.store(a, 0, s), SIMD.Float32x4.store(a, 4, u), SIMD.Float32x4.store(a, 8, e), SIMD.Float32x4.store(a, 12, m), a }, mat4.adjoint = glMatrix.USE_SIMD ? mat4.SIMD.adjoint : mat4.scalar.adjoint, mat4.determinant = function(a) {
                var t = a[0],
                    l = a[1],
                    o = a[2],
                    M = a[3],
                    S = a[4],
                    x = a[5],
                    I = a[6],
                    D = a[7],
                    F = a[8],
                    r = a[9],
                    s = a[10],
                    u = a[11],
                    e = a[12],
                    m = a[13],
                    n = a[14],
                    i = a[15],
                    h = t * x - l * S,
                    d = t * I - o * S,
                    z = t * D - M * S,
                    f = l * I - o * x,
                    c = l * D - M * x,
                    b = o * D - M * I,
                    w = F * m - r * e,
                    v = F * n - s * e,
                    p = F * i - u * e,
                    g = r * n - s * m,
                    E = r * i - u * m,
                    P = s * i - u * n;
                return h * P - d * E + z * g + f * p - c * v + b * w }, mat4.SIMD.multiply = function(a, t, l) {
                var o = SIMD.Float32x4.load(t, 0),
                    M = SIMD.Float32x4.load(t, 4),
                    S = SIMD.Float32x4.load(t, 8),
                    x = SIMD.Float32x4.load(t, 12),
                    I = SIMD.Float32x4.load(l, 0),
                    D = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I, 1, 1, 1, 1), M), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I, 2, 2, 2, 2), S), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(I, 3, 3, 3, 3), x))));
                SIMD.Float32x4.store(a, 0, D);
                var F = SIMD.Float32x4.load(l, 4),
                    r = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F, 1, 1, 1, 1), M), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F, 2, 2, 2, 2), S), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(F, 3, 3, 3, 3), x))));
                SIMD.Float32x4.store(a, 4, r);
                var s = SIMD.Float32x4.load(l, 8),
                    u = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 1, 1, 1, 1), M), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 2, 2, 2, 2), S), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(s, 3, 3, 3, 3), x))));
                SIMD.Float32x4.store(a, 8, u);
                var e = SIMD.Float32x4.load(l, 12),
                    m = SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 0, 0, 0, 0), o), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 1, 1, 1, 1), M), SIMD.Float32x4.add(SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 2, 2, 2, 2), S), SIMD.Float32x4.mul(SIMD.Float32x4.swizzle(e, 3, 3, 3, 3), x))));
                return SIMD.Float32x4.store(a, 12, m), a }, mat4.scalar.multiply = function(a, t, l) {
                var o = t[0],
                    M = t[1],
                    S = t[2],
                    x = t[3],
                    I = t[4],
                    D = t[5],
                    F = t[6],
                    r = t[7],
                    s = t[8],
                    u = t[9],
                    e = t[10],
                    m = t[11],
                    n = t[12],
                    i = t[13],
                    h = t[14],
                    d = t[15],
                    z = l[0],
                    f = l[1],
                    c = l[2],
                    b = l[3];
                return a[0] = z * o + f * I + c * s + b * n, a[1] = z * M + f * D + c * u + b * i, a[2] = z * S + f * F + c * e + b * h, a[3] = z * x + f * r + c * m + b * d, z = l[4], f = l[5], c = l[6], b = l[7], a[4] = z * o + f * I + c * s + b * n, a[5] = z * M + f * D + c * u + b * i, a[6] = z * S + f * F + c * e + b * h, a[7] = z * x + f * r + c * m + b * d, z = l[8], f = l[9], c = l[10], b = l[11], a[8] = z * o + f * I + c * s + b * n, a[9] = z * M + f * D + c * u + b * i, a[10] = z * S + f * F + c * e + b * h, a[11] = z * x + f * r + c * m + b * d, z = l[12], f = l[13], c = l[14], b = l[15], a[12] = z * o + f * I + c * s + b * n, a[13] = z * M + f * D + c * u + b * i, a[14] = z * S + f * F + c * e + b * h, a[15] = z * x + f * r + c * m + b * d, a }, mat4.multiply = glMatrix.USE_SIMD ? mat4.SIMD.multiply : mat4.scalar.multiply, mat4.mul = mat4.multiply, mat4.scalar.translate = function(a, t, l) {
                var o, M, S, x, I, D, F, r, s, u, e, m, n = l[0],
                    i = l[1],
                    h = l[2];
                return t === a ? (a[12] = t[0] * n + t[4] * i + t[8] * h + t[12], a[13] = t[1] * n + t[5] * i + t[9] * h + t[13], a[14] = t[2] * n + t[6] * i + t[10] * h + t[14], a[15] = t[3] * n + t[7] * i + t[11] * h + t[15]) : (o = t[0], M = t[1], S = t[2], x = t[3], I = t[4], D = t[5], F = t[6], r = t[7], s = t[8], u = t[9], e = t[10], m = t[11], a[0] = o, a[1] = M, a[2] = S, a[3] = x, a[4] = I, a[5] = D, a[6] = F, a[7] = r, a[8] = s, a[9] = u, a[10] = e, a[11] = m, a[12] = o * n + I * i + s * h + t[12], a[13] = M * n + D * i + u * h + t[13], a[14] = S * n + F * i + e * h + t[14], a[15] = x * n + r * i + m * h + t[15]), a }, mat4.SIMD.translate = function(a, t, l) {
                var o = SIMD.Float32x4.load(t, 0),
                    M = SIMD.Float32x4.load(t, 4),
                    S = SIMD.Float32x4.load(t, 8),
                    x = SIMD.Float32x4.load(t, 12),
                    I = SIMD.Float32x4(l[0], l[1], l[2], 0);
                t !== a && (a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11]), o = SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(I, 0, 0, 0, 0)), M = SIMD.Float32x4.mul(M, SIMD.Float32x4.swizzle(I, 1, 1, 1, 1)), S = SIMD.Float32x4.mul(S, SIMD.Float32x4.swizzle(I, 2, 2, 2, 2));
                var D = SIMD.Float32x4.add(o, SIMD.Float32x4.add(M, SIMD.Float32x4.add(S, x)));
                return SIMD.Float32x4.store(a, 12, D), a }, mat4.translate = glMatrix.USE_SIMD ? mat4.SIMD.translate : mat4.scalar.translate, mat4.scalar.scale = function(a, t, l) {
                var o = l[0],
                    M = l[1],
                    S = l[2];
                return a[0] = t[0] * o, a[1] = t[1] * o, a[2] = t[2] * o, a[3] = t[3] * o, a[4] = t[4] * M, a[5] = t[5] * M, a[6] = t[6] * M, a[7] = t[7] * M, a[8] = t[8] * S, a[9] = t[9] * S, a[10] = t[10] * S, a[11] = t[11] * S, a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a }, mat4.SIMD.scale = function(a, t, l) {
                var o, M, S, x = SIMD.Float32x4(l[0], l[1], l[2], 0);
                return o = SIMD.Float32x4.load(t, 0), SIMD.Float32x4.store(a, 0, SIMD.Float32x4.mul(o, SIMD.Float32x4.swizzle(x, 0, 0, 0, 0))), M = SIMD.Float32x4.load(t, 4), SIMD.Float32x4.store(a, 4, SIMD.Float32x4.mul(M, SIMD.Float32x4.swizzle(x, 1, 1, 1, 1))), S = SIMD.Float32x4.load(t, 8), SIMD.Float32x4.store(a, 8, SIMD.Float32x4.mul(S, SIMD.Float32x4.swizzle(x, 2, 2, 2, 2))), a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15], a }, mat4.scale = glMatrix.USE_SIMD ? mat4.SIMD.scale : mat4.scalar.scale, mat4.rotate = function(a, t, l, o) {
                var M, S, x, I, D, F, r, s, u, e, m, n, i, h, d, z, f, c, b, w, v, p, g, E, P = o[0],
                    O = o[1],
                    L = o[2],
                    N = Math.sqrt(P * P + O * O + L * L);
                return Math.abs(N) < glMatrix.EPSILON ? null : (N = 1 / N, P *= N, O *= N, L *= N, M = Math.sin(l), S = Math.cos(l), x = 1 - S, I = t[0], D = t[1], F = t[2], r = t[3], s = t[4], u = t[5], e = t[6], m = t[7], n = t[8], i = t[9], h = t[10], d = t[11], z = P * P * x + S, f = O * P * x + L * M, c = L * P * x - O * M, b = P * O * x - L * M, w = O * O * x + S, v = L * O * x + P * M, p = P * L * x + O * M, g = O * L * x - P * M, E = L * L * x + S, a[0] = I * z + s * f + n * c, a[1] = D * z + u * f + i * c, a[2] = F * z + e * f + h * c, a[3] = r * z + m * f + d * c, a[4] = I * b + s * w + n * v, a[5] = D * b + u * w + i * v, a[6] = F * b + e * w + h * v, a[7] = r * b + m * w + d * v, a[8] = I * p + s * g + n * E, a[9] = D * p + u * g + i * E, a[10] = F * p + e * g + h * E, a[11] = r * p + m * g + d * E, t !== a && (a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]), a) }, mat4.scalar.rotateX = function(a, t, l) {
                var o = Math.sin(l),
                    M = Math.cos(l),
                    S = t[4],
                    x = t[5],
                    I = t[6],
                    D = t[7],
                    F = t[8],
                    r = t[9],
                    s = t[10],
                    u = t[11];
                return t !== a && (a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]), a[4] = S * M + F * o, a[5] = x * M + r * o, a[6] = I * M + s * o, a[7] = D * M + u * o, a[8] = F * M - S * o, a[9] = r * M - x * o, a[10] = s * M - I * o, a[11] = u * M - D * o, a }, mat4.SIMD.rotateX = function(a, t, l) {
                var o = SIMD.Float32x4.splat(Math.sin(l)),
                    M = SIMD.Float32x4.splat(Math.cos(l));
                t !== a && (a[0] = t[0], a[1] = t[1], a[2] = t[2], a[3] = t[3], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]);
                var S = SIMD.Float32x4.load(t, 4),
                    x = SIMD.Float32x4.load(t, 8);
                return SIMD.Float32x4.store(a, 4, SIMD.Float32x4.add(SIMD.Float32x4.mul(S, M), SIMD.Float32x4.mul(x, o))), SIMD.Float32x4.store(a, 8, SIMD.Float32x4.sub(SIMD.Float32x4.mul(x, M), SIMD.Float32x4.mul(S, o))), a }, mat4.rotateX = glMatrix.USE_SIMD ? mat4.SIMD.rotateX : mat4.scalar.rotateX, mat4.scalar.rotateY = function(a, t, l) {
                var o = Math.sin(l),
                    M = Math.cos(l),
                    S = t[0],
                    x = t[1],
                    I = t[2],
                    D = t[3],
                    F = t[8],
                    r = t[9],
                    s = t[10],
                    u = t[11];
                return t !== a && (a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]), a[0] = S * M - F * o, a[1] = x * M - r * o, a[2] = I * M - s * o, a[3] = D * M - u * o, a[8] = S * o + F * M, a[9] = x * o + r * M, a[10] = I * o + s * M, a[11] = D * o + u * M, a }, mat4.SIMD.rotateY = function(a, t, l) {
                var o = SIMD.Float32x4.splat(Math.sin(l)),
                    M = SIMD.Float32x4.splat(Math.cos(l));
                t !== a && (a[4] = t[4], a[5] = t[5], a[6] = t[6], a[7] = t[7], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]);
                var S = SIMD.Float32x4.load(t, 0),
                    x = SIMD.Float32x4.load(t, 8);
                return SIMD.Float32x4.store(a, 0, SIMD.Float32x4.sub(SIMD.Float32x4.mul(S, M), SIMD.Float32x4.mul(x, o))), SIMD.Float32x4.store(a, 8, SIMD.Float32x4.add(SIMD.Float32x4.mul(S, o), SIMD.Float32x4.mul(x, M))), a }, mat4.rotateY = glMatrix.USE_SIMD ? mat4.SIMD.rotateY : mat4.scalar.rotateY, mat4.scalar.rotateZ = function(a, t, l) {
                var o = Math.sin(l),
                    M = Math.cos(l),
                    S = t[0],
                    x = t[1],
                    I = t[2],
                    D = t[3],
                    F = t[4],
                    r = t[5],
                    s = t[6],
                    u = t[7];
                return t !== a && (a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]), a[0] = S * M + F * o, a[1] = x * M + r * o, a[2] = I * M + s * o, a[3] = D * M + u * o, a[4] = F * M - S * o, a[5] = r * M - x * o, a[6] = s * M - I * o, a[7] = u * M - D * o, a }, mat4.SIMD.rotateZ = function(a, t, l) {
                var o = SIMD.Float32x4.splat(Math.sin(l)),
                    M = SIMD.Float32x4.splat(Math.cos(l));
                t !== a && (a[8] = t[8], a[9] = t[9], a[10] = t[10], a[11] = t[11], a[12] = t[12], a[13] = t[13], a[14] = t[14], a[15] = t[15]);
                var S = SIMD.Float32x4.load(t, 0),
                    x = SIMD.Float32x4.load(t, 4);
                return SIMD.Float32x4.store(a, 0, SIMD.Float32x4.add(SIMD.Float32x4.mul(S, M), SIMD.Float32x4.mul(x, o))), SIMD.Float32x4.store(a, 4, SIMD.Float32x4.sub(SIMD.Float32x4.mul(x, M), SIMD.Float32x4.mul(S, o))), a }, mat4.rotateZ = glMatrix.USE_SIMD ? mat4.SIMD.rotateZ : mat4.scalar.rotateZ, mat4.fromTranslation = function(a, t) {
                return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = t[0], a[13] = t[1], a[14] = t[2], a[15] = 1, a }, mat4.fromScaling = function(a, t) {
                return a[0] = t[0], a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = t[1], a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = t[2], a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.fromRotation = function(a, t, l) {
                var o, M, S, x = l[0],
                    I = l[1],
                    D = l[2],
                    F = Math.sqrt(x * x + I * I + D * D);
                return Math.abs(F) < glMatrix.EPSILON ? null : (F = 1 / F, x *= F, I *= F, D *= F, o = Math.sin(t), M = Math.cos(t), S = 1 - M, a[0] = x * x * S + M, a[1] = I * x * S + D * o, a[2] = D * x * S - I * o, a[3] = 0, a[4] = x * I * S - D * o, a[5] = I * I * S + M, a[6] = D * I * S + x * o, a[7] = 0, a[8] = x * D * S + I * o, a[9] = I * D * S - x * o, a[10] = D * D * S + M, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a) }, mat4.fromXRotation = function(a, t) {
                var l = Math.sin(t),
                    o = Math.cos(t);
                return a[0] = 1, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = o, a[6] = l, a[7] = 0, a[8] = 0, a[9] = -l, a[10] = o, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.fromYRotation = function(a, t) {
                var l = Math.sin(t),
                    o = Math.cos(t);
                return a[0] = o, a[1] = 0, a[2] = -l, a[3] = 0, a[4] = 0, a[5] = 1, a[6] = 0, a[7] = 0, a[8] = l, a[9] = 0, a[10] = o, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.fromZRotation = function(a, t) {
                var l = Math.sin(t),
                    o = Math.cos(t);
                return a[0] = o, a[1] = l, a[2] = 0, a[3] = 0, a[4] = -l, a[5] = o, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 1, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.fromRotationTranslation = function(a, t, l) {
                var o = t[0],
                    M = t[1],
                    S = t[2],
                    x = t[3],
                    I = o + o,
                    D = M + M,
                    F = S + S,
                    r = o * I,
                    s = o * D,
                    u = o * F,
                    e = M * D,
                    m = M * F,
                    n = S * F,
                    i = x * I,
                    h = x * D,
                    d = x * F;
                return a[0] = 1 - (e + n), a[1] = s + d, a[2] = u - h, a[3] = 0, a[4] = s - d, a[5] = 1 - (r + n), a[6] = m + i, a[7] = 0, a[8] = u + h, a[9] = m - i, a[10] = 1 - (r + e), a[11] = 0, a[12] = l[0], a[13] = l[1], a[14] = l[2], a[15] = 1, a }, mat4.getTranslation = function(a, t) {
                return a[0] = t[12], a[1] = t[13], a[2] = t[14], a }, mat4.getRotation = function(a, t) {
                var l = t[0] + t[5] + t[10],
                    o = 0;
                return l > 0 ? (o = 2 * Math.sqrt(l + 1), a[3] = .25 * o, a[0] = (t[6] - t[9]) / o, a[1] = (t[8] - t[2]) / o, a[2] = (t[1] - t[4]) / o) : t[0] > t[5] & t[0] > t[10] ? (o = 2 * Math.sqrt(1 + t[0] - t[5] - t[10]), a[3] = (t[6] - t[9]) / o, a[0] = .25 * o, a[1] = (t[1] + t[4]) / o, a[2] = (t[8] + t[2]) / o) : t[5] > t[10] ? (o = 2 * Math.sqrt(1 + t[5] - t[0] - t[10]), a[3] = (t[8] - t[2]) / o, a[0] = (t[1] + t[4]) / o, a[1] = .25 * o, a[2] = (t[6] + t[9]) / o) : (o = 2 * Math.sqrt(1 + t[10] - t[0] - t[5]), a[3] = (t[1] - t[4]) / o, a[0] = (t[8] + t[2]) / o, a[1] = (t[6] + t[9]) / o, a[2] = .25 * o), a }, mat4.fromRotationTranslationScale = function(a, t, l, o) {
                var M = t[0],
                    S = t[1],
                    x = t[2],
                    I = t[3],
                    D = M + M,
                    F = S + S,
                    r = x + x,
                    s = M * D,
                    u = M * F,
                    e = M * r,
                    m = S * F,
                    n = S * r,
                    i = x * r,
                    h = I * D,
                    d = I * F,
                    z = I * r,
                    f = o[0],
                    c = o[1],
                    b = o[2];
                return a[0] = (1 - (m + i)) * f, a[1] = (u + z) * f, a[2] = (e - d) * f, a[3] = 0, a[4] = (u - z) * c, a[5] = (1 - (s + i)) * c, a[6] = (n + h) * c, a[7] = 0, a[8] = (e + d) * b, a[9] = (n - h) * b, a[10] = (1 - (s + m)) * b, a[11] = 0, a[12] = l[0], a[13] = l[1], a[14] = l[2], a[15] = 1, a }, mat4.fromRotationTranslationScaleOrigin = function(a, t, l, o, M) {
                var S = t[0],
                    x = t[1],
                    I = t[2],
                    D = t[3],
                    F = S + S,
                    r = x + x,
                    s = I + I,
                    u = S * F,
                    e = S * r,
                    m = S * s,
                    n = x * r,
                    i = x * s,
                    h = I * s,
                    d = D * F,
                    z = D * r,
                    f = D * s,
                    c = o[0],
                    b = o[1],
                    w = o[2],
                    v = M[0],
                    p = M[1],
                    g = M[2];
                return a[0] = (1 - (n + h)) * c, a[1] = (e + f) * c, a[2] = (m - z) * c, a[3] = 0, a[4] = (e - f) * b, a[5] = (1 - (u + h)) * b, a[6] = (i + d) * b, a[7] = 0, a[8] = (m + z) * w, a[9] = (i - d) * w, a[10] = (1 - (u + n)) * w, a[11] = 0, a[12] = l[0] + v - (a[0] * v + a[4] * p + a[8] * g), a[13] = l[1] + p - (a[1] * v + a[5] * p + a[9] * g), a[14] = l[2] + g - (a[2] * v + a[6] * p + a[10] * g), a[15] = 1, a }, mat4.fromQuat = function(a, t) {
                var l = t[0],
                    o = t[1],
                    M = t[2],
                    S = t[3],
                    x = l + l,
                    I = o + o,
                    D = M + M,
                    F = l * x,
                    r = o * x,
                    s = o * I,
                    u = M * x,
                    e = M * I,
                    m = M * D,
                    n = S * x,
                    i = S * I,
                    h = S * D;
                return a[0] = 1 - s - m, a[1] = r + h, a[2] = u - i, a[3] = 0, a[4] = r - h, a[5] = 1 - F - m, a[6] = e + n, a[7] = 0, a[8] = u + i, a[9] = e - n, a[10] = 1 - F - s, a[11] = 0, a[12] = 0, a[13] = 0, a[14] = 0, a[15] = 1, a }, mat4.frustum = function(a, t, l, o, M, S, x) {
                var I = 1 / (l - t),
                    D = 1 / (M - o),
                    F = 1 / (S - x);
                return a[0] = 2 * S * I, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = 2 * S * D, a[6] = 0, a[7] = 0, a[8] = (l + t) * I, a[9] = (M + o) * D, a[10] = (x + S) * F, a[11] = -1, a[12] = 0, a[13] = 0, a[14] = x * S * 2 * F, a[15] = 0, a }, mat4.perspective = function(a, t, l, o, M) {
                var S = 1 / Math.tan(t / 2),
                    x = 1 / (o - M);
                return a[0] = S / l, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = S, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = (M + o) * x, a[11] = -1, a[12] = 0, a[13] = 0, a[14] = 2 * M * o * x, a[15] = 0, a }, mat4.perspectiveFromFieldOfView = function(a, t, l, o) {
                var M = Math.tan(t.upDegrees * Math.PI / 180),
                    S = Math.tan(t.downDegrees * Math.PI / 180),
                    x = Math.tan(t.leftDegrees * Math.PI / 180),
                    I = Math.tan(t.rightDegrees * Math.PI / 180),
                    D = 2 / (x + I),
                    F = 2 / (M + S);
                return a[0] = D, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = F, a[6] = 0, a[7] = 0, a[8] = -((x - I) * D * .5), a[9] = (M - S) * F * .5, a[10] = o / (l - o), a[11] = -1, a[12] = 0, a[13] = 0, a[14] = o * l / (l - o), a[15] = 0, a }, mat4.ortho = function(a, t, l, o, M, S, x) {
                var I = 1 / (t - l),
                    D = 1 / (o - M),
                    F = 1 / (S - x);
                return a[0] = -2 * I, a[1] = 0, a[2] = 0, a[3] = 0, a[4] = 0, a[5] = -2 * D, a[6] = 0, a[7] = 0, a[8] = 0, a[9] = 0, a[10] = 2 * F, a[11] = 0, a[12] = (t + l) * I, a[13] = (M + o) * D, a[14] = (x + S) * F, a[15] = 1, a }, mat4.lookAt = function(a, t, l, o) {
                var M, S, x, I, D, F, r, s, u, e, m = t[0],
                    n = t[1],
                    i = t[2],
                    h = o[0],
                    d = o[1],
                    z = o[2],
                    f = l[0],
                    c = l[1],
                    b = l[2];
                return Math.abs(m - f) < glMatrix.EPSILON && Math.abs(n - c) < glMatrix.EPSILON && Math.abs(i - b) < glMatrix.EPSILON ? mat4.identity(a) : (r = m - f, s = n - c, u = i - b, e = 1 / Math.sqrt(r * r + s * s + u * u), r *= e, s *= e, u *= e, M = d * u - z * s, S = z * r - h * u, x = h * s - d * r, e = Math.sqrt(M * M + S * S + x * x), e ? (e = 1 / e, M *= e, S *= e, x *= e) : (M = 0, S = 0, x = 0), I = s * x - u * S, D = u * M - r * x, F = r * S - s * M, e = Math.sqrt(I * I + D * D + F * F), e ? (e = 1 / e, I *= e, D *= e, F *= e) : (I = 0, D = 0, F = 0), a[0] = M, a[1] = I, a[2] = r, a[3] = 0, a[4] = S, a[5] = D, a[6] = s, a[7] = 0, a[8] = x, a[9] = F, a[10] = u, a[11] = 0, a[12] = -(M * m + S * n + x * i), a[13] = -(I * m + D * n + F * i), a[14] = -(r * m + s * n + u * i), a[15] = 1, a) }, mat4.str = function(a) {
                return "mat4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ", " + a[4] + ", " + a[5] + ", " + a[6] + ", " + a[7] + ", " + a[8] + ", " + a[9] + ", " + a[10] + ", " + a[11] + ", " + a[12] + ", " + a[13] + ", " + a[14] + ", " + a[15] + ")" }, mat4.frob = function(a) {
                return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2)) }, mat4.add = function(a, t, l) {
                return a[0] = t[0] + l[0], a[1] = t[1] + l[1], a[2] = t[2] + l[2], a[3] = t[3] + l[3], a[4] = t[4] + l[4], a[5] = t[5] + l[5], a[6] = t[6] + l[6], a[7] = t[7] + l[7], a[8] = t[8] + l[8], a[9] = t[9] + l[9], a[10] = t[10] + l[10], a[11] = t[11] + l[11], a[12] = t[12] + l[12], a[13] = t[13] + l[13], a[14] = t[14] + l[14], a[15] = t[15] + l[15], a }, mat4.subtract = function(a, t, l) {
                return a[0] = t[0] - l[0], a[1] = t[1] - l[1], a[2] = t[2] - l[2], a[3] = t[3] - l[3], a[4] = t[4] - l[4], a[5] = t[5] - l[5], a[6] = t[6] - l[6], a[7] = t[7] - l[7], a[8] = t[8] - l[8], a[9] = t[9] - l[9], a[10] = t[10] - l[10], a[11] = t[11] - l[11], a[12] = t[12] - l[12], a[13] = t[13] - l[13], a[14] = t[14] - l[14], a[15] = t[15] - l[15], a }, mat4.sub = mat4.subtract, mat4.multiplyScalar = function(a, t, l) {
                return a[0] = t[0] * l, a[1] = t[1] * l, a[2] = t[2] * l, a[3] = t[3] * l, a[4] = t[4] * l, a[5] = t[5] * l, a[6] = t[6] * l, a[7] = t[7] * l, a[8] = t[8] * l, a[9] = t[9] * l, a[10] = t[10] * l, a[11] = t[11] * l, a[12] = t[12] * l, a[13] = t[13] * l, a[14] = t[14] * l, a[15] = t[15] * l, a }, mat4.multiplyScalarAndAdd = function(a, t, l, o) {
                return a[0] = t[0] + l[0] * o, a[1] = t[1] + l[1] * o, a[2] = t[2] + l[2] * o, a[3] = t[3] + l[3] * o, a[4] = t[4] + l[4] * o, a[5] = t[5] + l[5] * o, a[6] = t[6] + l[6] * o, a[7] = t[7] + l[7] * o, a[8] = t[8] + l[8] * o, a[9] = t[9] + l[9] * o, a[10] = t[10] + l[10] * o, a[11] = t[11] + l[11] * o, a[12] = t[12] + l[12] * o, a[13] = t[13] + l[13] * o, a[14] = t[14] + l[14] * o, a[15] = t[15] + l[15] * o, a }, mat4.exactEquals = function(a, t) {
                return a[0] === t[0] && a[1] === t[1] && a[2] === t[2] && a[3] === t[3] && a[4] === t[4] && a[5] === t[5] && a[6] === t[6] && a[7] === t[7] && a[8] === t[8] && a[9] === t[9] && a[10] === t[10] && a[11] === t[11] && a[12] === t[12] && a[13] === t[13] && a[14] === t[14] && a[15] === t[15] }, mat4.equals = function(a, t) {
                var l = a[0],
                    o = a[1],
                    M = a[2],
                    S = a[3],
                    x = a[4],
                    I = a[5],
                    D = a[6],
                    F = a[7],
                    r = a[8],
                    s = a[9],
                    u = a[10],
                    e = a[11],
                    m = a[12],
                    n = a[13],
                    i = a[14],
                    h = a[15],
                    d = t[0],
                    z = t[1],
                    f = t[2],
                    c = t[3],
                    b = t[4],
                    w = t[5],
                    v = t[6],
                    p = t[7],
                    g = t[8],
                    E = t[9],
                    P = t[10],
                    O = t[11],
                    L = t[12],
                    N = t[13],
                    R = t[14],
                    q = t[15];
                return Math.abs(l - d) <= glMatrix.EPSILON * Math.max(1, Math.abs(l), Math.abs(d)) && Math.abs(o - z) <= glMatrix.EPSILON * Math.max(1, Math.abs(o), Math.abs(z)) && Math.abs(M - f) <= glMatrix.EPSILON * Math.max(1, Math.abs(M), Math.abs(f)) && Math.abs(S - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(S), Math.abs(c)) && Math.abs(x - b) <= glMatrix.EPSILON * Math.max(1, Math.abs(x), Math.abs(b)) && Math.abs(I - w) <= glMatrix.EPSILON * Math.max(1, Math.abs(I), Math.abs(w)) && Math.abs(D - v) <= glMatrix.EPSILON * Math.max(1, Math.abs(D), Math.abs(v)) && Math.abs(F - p) <= glMatrix.EPSILON * Math.max(1, Math.abs(F), Math.abs(p)) && Math.abs(r - g) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(g)) && Math.abs(s - E) <= glMatrix.EPSILON * Math.max(1, Math.abs(s), Math.abs(E)) && Math.abs(u - P) <= glMatrix.EPSILON * Math.max(1, Math.abs(u), Math.abs(P)) && Math.abs(e - O) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(O)) && Math.abs(m - L) <= glMatrix.EPSILON * Math.max(1, Math.abs(m), Math.abs(L)) && Math.abs(n - N) <= glMatrix.EPSILON * Math.max(1, Math.abs(n), Math.abs(N)) && Math.abs(i - R) <= glMatrix.EPSILON * Math.max(1, Math.abs(i), Math.abs(R)) && Math.abs(h - q) <= glMatrix.EPSILON * Math.max(1, Math.abs(h), Math.abs(q)) }, module.exports = mat4;
        }, { "./common.js": 151 }],
        156: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                mat3 = require("./mat3.js"),
                vec3 = require("./vec3.js"),
                vec4 = require("./vec4.js"),
                quat = {};
            quat.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t }, quat.rotationTo = function() {
                var t = vec3.create(),
                    a = vec3.fromValues(1, 0, 0),
                    e = vec3.fromValues(0, 1, 0);
                return function(u, r, n) {
                    var c = vec3.dot(r, n);
                    return c < -.999999 ? (vec3.cross(t, a, r), vec3.length(t) < 1e-6 && vec3.cross(t, e, r), vec3.normalize(t, t), quat.setAxisAngle(u, t, Math.PI), u) : c > .999999 ? (u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 1, u) : (vec3.cross(t, r, n), u[0] = t[0], u[1] = t[1], u[2] = t[2], u[3] = 1 + c, quat.normalize(u, u)) } }(), quat.setAxes = function() {
                var t = mat3.create();
                return function(a, e, u, r) {
                    return t[0] = u[0], t[3] = u[1], t[6] = u[2], t[1] = r[0], t[4] = r[1], t[7] = r[2], t[2] = -e[0], t[5] = -e[1], t[8] = -e[2], quat.normalize(a, quat.fromMat3(a, t)) } }(), quat.clone = vec4.clone, quat.fromValues = vec4.fromValues, quat.copy = vec4.copy, quat.set = vec4.set, quat.identity = function(t) {
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 1, t }, quat.setAxisAngle = function(t, a, e) { e = .5 * e;
                var u = Math.sin(e);
                return t[0] = u * a[0], t[1] = u * a[1], t[2] = u * a[2], t[3] = Math.cos(e), t }, quat.getAxisAngle = function(t, a) {
                var e = 2 * Math.acos(a[3]),
                    u = Math.sin(e / 2);
                return 0 != u ? (t[0] = a[0] / u, t[1] = a[1] / u, t[2] = a[2] / u) : (t[0] = 1, t[1] = 0, t[2] = 0), e }, quat.add = vec4.add, quat.multiply = function(t, a, e) {
                var u = a[0],
                    r = a[1],
                    n = a[2],
                    c = a[3],
                    q = e[0],
                    s = e[1],
                    o = e[2],
                    i = e[3];
                return t[0] = u * i + c * q + r * o - n * s, t[1] = r * i + c * s + n * q - u * o, t[2] = n * i + c * o + u * s - r * q, t[3] = c * i - u * q - r * s - n * o, t }, quat.mul = quat.multiply, quat.scale = vec4.scale, quat.rotateX = function(t, a, e) { e *= .5;
                var u = a[0],
                    r = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    s = Math.cos(e);
                return t[0] = u * s + c * q, t[1] = r * s + n * q, t[2] = n * s - r * q, t[3] = c * s - u * q, t }, quat.rotateY = function(t, a, e) { e *= .5;
                var u = a[0],
                    r = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    s = Math.cos(e);
                return t[0] = u * s - n * q, t[1] = r * s + c * q, t[2] = n * s + u * q, t[3] = c * s - r * q, t }, quat.rotateZ = function(t, a, e) { e *= .5;
                var u = a[0],
                    r = a[1],
                    n = a[2],
                    c = a[3],
                    q = Math.sin(e),
                    s = Math.cos(e);
                return t[0] = u * s + r * q, t[1] = r * s - u * q, t[2] = n * s + c * q, t[3] = c * s - n * q, t }, quat.calculateW = function(t, a) {
                var e = a[0],
                    u = a[1],
                    r = a[2];
                return t[0] = e, t[1] = u, t[2] = r, t[3] = Math.sqrt(Math.abs(1 - e * e - u * u - r * r)), t }, quat.dot = vec4.dot, quat.lerp = vec4.lerp, quat.slerp = function(t, a, e, u) {
                var r, n, c, q, s, o = a[0],
                    i = a[1],
                    v = a[2],
                    l = a[3],
                    f = e[0],
                    h = e[1],
                    M = e[2],
                    m = e[3];
                return n = o * f + i * h + v * M + l * m, n < 0 && (n = -n, f = -f, h = -h, M = -M, m = -m), 1 - n > 1e-6 ? (r = Math.acos(n), c = Math.sin(r), q = Math.sin((1 - u) * r) / c, s = Math.sin(u * r) / c) : (q = 1 - u, s = u), t[0] = q * o + s * f, t[1] = q * i + s * h, t[2] = q * v + s * M, t[3] = q * l + s * m, t }, quat.sqlerp = function() {
                var t = quat.create(),
                    a = quat.create();
                return function(e, u, r, n, c, q) {
                    return quat.slerp(t, u, c, q), quat.slerp(a, r, n, q), quat.slerp(e, t, a, 2 * q * (1 - q)), e } }(), quat.invert = function(t, a) {
                var e = a[0],
                    u = a[1],
                    r = a[2],
                    n = a[3],
                    c = e * e + u * u + r * r + n * n,
                    q = c ? 1 / c : 0;
                return t[0] = -e * q, t[1] = -u * q, t[2] = -r * q, t[3] = n * q, t }, quat.conjugate = function(t, a) {
                return t[0] = -a[0], t[1] = -a[1], t[2] = -a[2], t[3] = a[3], t }, quat.length = vec4.length, quat.len = quat.length, quat.squaredLength = vec4.squaredLength, quat.sqrLen = quat.squaredLength, quat.normalize = vec4.normalize, quat.fromMat3 = function(t, a) {
                var e, u = a[0] + a[4] + a[8];
                if (u > 0) e = Math.sqrt(u + 1), t[3] = .5 * e, e = .5 / e, t[0] = (a[5] - a[7]) * e, t[1] = (a[6] - a[2]) * e, t[2] = (a[1] - a[3]) * e;
                else {
                    var r = 0;
                    a[4] > a[0] && (r = 1), a[8] > a[3 * r + r] && (r = 2);
                    var n = (r + 1) % 3,
                        c = (r + 2) % 3;
                    e = Math.sqrt(a[3 * r + r] - a[3 * n + n] - a[3 * c + c] + 1), t[r] = .5 * e, e = .5 / e, t[3] = (a[3 * n + c] - a[3 * c + n]) * e, t[n] = (a[3 * n + r] + a[3 * r + n]) * e, t[c] = (a[3 * c + r] + a[3 * r + c]) * e }
                return t }, quat.str = function(t) {
                return "quat(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, quat.exactEquals = vec4.exactEquals, quat.equals = vec4.equals, module.exports = quat;
        }, { "./common.js": 151, "./mat3.js": 154, "./vec3.js": 158, "./vec4.js": 159 }],
        157: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec2 = {};
            vec2.create = function() {
                var n = new glMatrix.ARRAY_TYPE(2);
                return n[0] = 0, n[1] = 0, n }, vec2.clone = function(n) {
                var t = new glMatrix.ARRAY_TYPE(2);
                return t[0] = n[0], t[1] = n[1], t }, vec2.fromValues = function(n, t) {
                var r = new glMatrix.ARRAY_TYPE(2);
                return r[0] = n, r[1] = t, r }, vec2.copy = function(n, t) {
                return n[0] = t[0], n[1] = t[1], n }, vec2.set = function(n, t, r) {
                return n[0] = t, n[1] = r, n }, vec2.add = function(n, t, r) {
                return n[0] = t[0] + r[0], n[1] = t[1] + r[1], n }, vec2.subtract = function(n, t, r) {
                return n[0] = t[0] - r[0], n[1] = t[1] - r[1], n }, vec2.sub = vec2.subtract, vec2.multiply = function(n, t, r) {
                return n[0] = t[0] * r[0], n[1] = t[1] * r[1], n }, vec2.mul = vec2.multiply, vec2.divide = function(n, t, r) {
                return n[0] = t[0] / r[0], n[1] = t[1] / r[1], n }, vec2.div = vec2.divide, vec2.ceil = function(n, t) {
                return n[0] = Math.ceil(t[0]), n[1] = Math.ceil(t[1]), n }, vec2.floor = function(n, t) {
                return n[0] = Math.floor(t[0]), n[1] = Math.floor(t[1]), n }, vec2.min = function(n, t, r) {
                return n[0] = Math.min(t[0], r[0]), n[1] = Math.min(t[1], r[1]), n }, vec2.max = function(n, t, r) {
                return n[0] = Math.max(t[0], r[0]), n[1] = Math.max(t[1], r[1]), n }, vec2.round = function(n, t) {
                return n[0] = Math.round(t[0]), n[1] = Math.round(t[1]), n }, vec2.scale = function(n, t, r) {
                return n[0] = t[0] * r, n[1] = t[1] * r, n }, vec2.scaleAndAdd = function(n, t, r, e) {
                return n[0] = t[0] + r[0] * e, n[1] = t[1] + r[1] * e, n }, vec2.distance = function(n, t) {
                var r = t[0] - n[0],
                    e = t[1] - n[1];
                return Math.sqrt(r * r + e * e) }, vec2.dist = vec2.distance, vec2.squaredDistance = function(n, t) {
                var r = t[0] - n[0],
                    e = t[1] - n[1];
                return r * r + e * e }, vec2.sqrDist = vec2.squaredDistance, vec2.length = function(n) {
                var t = n[0],
                    r = n[1];
                return Math.sqrt(t * t + r * r) }, vec2.len = vec2.length, vec2.squaredLength = function(n) {
                var t = n[0],
                    r = n[1];
                return t * t + r * r }, vec2.sqrLen = vec2.squaredLength, vec2.negate = function(n, t) {
                return n[0] = -t[0], n[1] = -t[1], n }, vec2.inverse = function(n, t) {
                return n[0] = 1 / t[0], n[1] = 1 / t[1], n }, vec2.normalize = function(n, t) {
                var r = t[0],
                    e = t[1],
                    c = r * r + e * e;
                return c > 0 && (c = 1 / Math.sqrt(c), n[0] = t[0] * c, n[1] = t[1] * c), n }, vec2.dot = function(n, t) {
                return n[0] * t[0] + n[1] * t[1] }, vec2.cross = function(n, t, r) {
                var e = t[0] * r[1] - t[1] * r[0];
                return n[0] = n[1] = 0, n[2] = e, n }, vec2.lerp = function(n, t, r, e) {
                var c = t[0],
                    a = t[1];
                return n[0] = c + e * (r[0] - c), n[1] = a + e * (r[1] - a), n }, vec2.random = function(n, t) { t = t || 1;
                var r = 2 * glMatrix.RANDOM() * Math.PI;
                return n[0] = Math.cos(r) * t, n[1] = Math.sin(r) * t, n }, vec2.transformMat2 = function(n, t, r) {
                var e = t[0],
                    c = t[1];
                return n[0] = r[0] * e + r[2] * c, n[1] = r[1] * e + r[3] * c, n }, vec2.transformMat2d = function(n, t, r) {
                var e = t[0],
                    c = t[1];
                return n[0] = r[0] * e + r[2] * c + r[4], n[1] = r[1] * e + r[3] * c + r[5], n }, vec2.transformMat3 = function(n, t, r) {
                var e = t[0],
                    c = t[1];
                return n[0] = r[0] * e + r[3] * c + r[6], n[1] = r[1] * e + r[4] * c + r[7], n }, vec2.transformMat4 = function(n, t, r) {
                var e = t[0],
                    c = t[1];
                return n[0] = r[0] * e + r[4] * c + r[12], n[1] = r[1] * e + r[5] * c + r[13], n }, vec2.forEach = function() {
                var n = vec2.create();
                return function(t, r, e, c, a, u) {
                    var v, i;
                    for (r || (r = 2), e || (e = 0), i = c ? Math.min(c * r + e, t.length) : t.length, v = e; v < i; v += r) n[0] = t[v], n[1] = t[v + 1], a(n, n, u), t[v] = n[0], t[v + 1] = n[1];
                    return t } }(), vec2.str = function(n) {
                return "vec2(" + n[0] + ", " + n[1] + ")" }, vec2.exactEquals = function(n, t) {
                return n[0] === t[0] && n[1] === t[1] }, vec2.equals = function(n, t) {
                var r = n[0],
                    e = n[1],
                    c = t[0],
                    a = t[1];
                return Math.abs(r - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(e - a) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(a)) }, module.exports = vec2;
        }, { "./common.js": 151 }],
        158: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec3 = {};
            vec3.create = function() {
                var t = new glMatrix.ARRAY_TYPE(3);
                return t[0] = 0, t[1] = 0, t[2] = 0, t }, vec3.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(3);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n }, vec3.fromValues = function(t, n, r) {
                var e = new glMatrix.ARRAY_TYPE(3);
                return e[0] = t, e[1] = n, e[2] = r, e }, vec3.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t }, vec3.set = function(t, n, r, e) {
                return t[0] = n, t[1] = r, t[2] = e, t }, vec3.add = function(t, n, r) {
                return t[0] = n[0] + r[0], t[1] = n[1] + r[1], t[2] = n[2] + r[2], t }, vec3.subtract = function(t, n, r) {
                return t[0] = n[0] - r[0], t[1] = n[1] - r[1], t[2] = n[2] - r[2], t }, vec3.sub = vec3.subtract, vec3.multiply = function(t, n, r) {
                return t[0] = n[0] * r[0], t[1] = n[1] * r[1], t[2] = n[2] * r[2], t }, vec3.mul = vec3.multiply, vec3.divide = function(t, n, r) {
                return t[0] = n[0] / r[0], t[1] = n[1] / r[1], t[2] = n[2] / r[2], t }, vec3.div = vec3.divide, vec3.ceil = function(t, n) {
                return t[0] = Math.ceil(n[0]), t[1] = Math.ceil(n[1]), t[2] = Math.ceil(n[2]), t }, vec3.floor = function(t, n) {
                return t[0] = Math.floor(n[0]), t[1] = Math.floor(n[1]), t[2] = Math.floor(n[2]), t }, vec3.min = function(t, n, r) {
                return t[0] = Math.min(n[0], r[0]), t[1] = Math.min(n[1], r[1]), t[2] = Math.min(n[2], r[2]), t }, vec3.max = function(t, n, r) {
                return t[0] = Math.max(n[0], r[0]), t[1] = Math.max(n[1], r[1]), t[2] = Math.max(n[2], r[2]), t }, vec3.round = function(t, n) {
                return t[0] = Math.round(n[0]), t[1] = Math.round(n[1]), t[2] = Math.round(n[2]), t }, vec3.scale = function(t, n, r) {
                return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t }, vec3.scaleAndAdd = function(t, n, r, e) {
                return t[0] = n[0] + r[0] * e, t[1] = n[1] + r[1] * e, t[2] = n[2] + r[2] * e, t }, vec3.distance = function(t, n) {
                var r = n[0] - t[0],
                    e = n[1] - t[1],
                    a = n[2] - t[2];
                return Math.sqrt(r * r + e * e + a * a) }, vec3.dist = vec3.distance, vec3.squaredDistance = function(t, n) {
                var r = n[0] - t[0],
                    e = n[1] - t[1],
                    a = n[2] - t[2];
                return r * r + e * e + a * a }, vec3.sqrDist = vec3.squaredDistance, vec3.length = function(t) {
                var n = t[0],
                    r = t[1],
                    e = t[2];
                return Math.sqrt(n * n + r * r + e * e) }, vec3.len = vec3.length, vec3.squaredLength = function(t) {
                var n = t[0],
                    r = t[1],
                    e = t[2];
                return n * n + r * r + e * e }, vec3.sqrLen = vec3.squaredLength, vec3.negate = function(t, n) {
                return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t }, vec3.inverse = function(t, n) {
                return t[0] = 1 / n[0], t[1] = 1 / n[1], t[2] = 1 / n[2], t }, vec3.normalize = function(t, n) {
                var r = n[0],
                    e = n[1],
                    a = n[2],
                    c = r * r + e * e + a * a;
                return c > 0 && (c = 1 / Math.sqrt(c), t[0] = n[0] * c, t[1] = n[1] * c, t[2] = n[2] * c), t }, vec3.dot = function(t, n) {
                return t[0] * n[0] + t[1] * n[1] + t[2] * n[2] }, vec3.cross = function(t, n, r) {
                var e = n[0],
                    a = n[1],
                    c = n[2],
                    u = r[0],
                    v = r[1],
                    i = r[2];
                return t[0] = a * i - c * v, t[1] = c * u - e * i, t[2] = e * v - a * u, t }, vec3.lerp = function(t, n, r, e) {
                var a = n[0],
                    c = n[1],
                    u = n[2];
                return t[0] = a + e * (r[0] - a), t[1] = c + e * (r[1] - c), t[2] = u + e * (r[2] - u), t }, vec3.hermite = function(t, n, r, e, a, c) {
                var u = c * c,
                    v = u * (2 * c - 3) + 1,
                    i = u * (c - 2) + c,
                    o = u * (c - 1),
                    M = u * (3 - 2 * c);
                return t[0] = n[0] * v + r[0] * i + e[0] * o + a[0] * M, t[1] = n[1] * v + r[1] * i + e[1] * o + a[1] * M, t[2] = n[2] * v + r[2] * i + e[2] * o + a[2] * M, t }, vec3.bezier = function(t, n, r, e, a, c) {
                var u = 1 - c,
                    v = u * u,
                    i = c * c,
                    o = v * u,
                    M = 3 * c * v,
                    s = 3 * i * u,
                    h = i * c;
                return t[0] = n[0] * o + r[0] * M + e[0] * s + a[0] * h, t[1] = n[1] * o + r[1] * M + e[1] * s + a[1] * h, t[2] = n[2] * o + r[2] * M + e[2] * s + a[2] * h, t }, vec3.random = function(t, n) { n = n || 1;
                var r = 2 * glMatrix.RANDOM() * Math.PI,
                    e = 2 * glMatrix.RANDOM() - 1,
                    a = Math.sqrt(1 - e * e) * n;
                return t[0] = Math.cos(r) * a, t[1] = Math.sin(r) * a, t[2] = e * n, t }, vec3.transformMat4 = function(t, n, r) {
                var e = n[0],
                    a = n[1],
                    c = n[2],
                    u = r[3] * e + r[7] * a + r[11] * c + r[15];
                return u = u || 1, t[0] = (r[0] * e + r[4] * a + r[8] * c + r[12]) / u, t[1] = (r[1] * e + r[5] * a + r[9] * c + r[13]) / u, t[2] = (r[2] * e + r[6] * a + r[10] * c + r[14]) / u, t }, vec3.transformMat3 = function(t, n, r) {
                var e = n[0],
                    a = n[1],
                    c = n[2];
                return t[0] = e * r[0] + a * r[3] + c * r[6], t[1] = e * r[1] + a * r[4] + c * r[7], t[2] = e * r[2] + a * r[5] + c * r[8], t }, vec3.transformQuat = function(t, n, r) {
                var e = n[0],
                    a = n[1],
                    c = n[2],
                    u = r[0],
                    v = r[1],
                    i = r[2],
                    o = r[3],
                    M = o * e + v * c - i * a,
                    s = o * a + i * e - u * c,
                    h = o * c + u * a - v * e,
                    f = -u * e - v * a - i * c;
                return t[0] = M * o + f * -u + s * -i - h * -v, t[1] = s * o + f * -v + h * -u - M * -i, t[2] = h * o + f * -i + M * -v - s * -u, t }, vec3.rotateX = function(t, n, r, e) {
                var a = [],
                    c = [];
                return a[0] = n[0] - r[0], a[1] = n[1] - r[1], a[2] = n[2] - r[2], c[0] = a[0], c[1] = a[1] * Math.cos(e) - a[2] * Math.sin(e), c[2] = a[1] * Math.sin(e) + a[2] * Math.cos(e), t[0] = c[0] + r[0], t[1] = c[1] + r[1], t[2] = c[2] + r[2], t }, vec3.rotateY = function(t, n, r, e) {
                var a = [],
                    c = [];
                return a[0] = n[0] - r[0], a[1] = n[1] - r[1], a[2] = n[2] - r[2], c[0] = a[2] * Math.sin(e) + a[0] * Math.cos(e), c[1] = a[1], c[2] = a[2] * Math.cos(e) - a[0] * Math.sin(e), t[0] = c[0] + r[0], t[1] = c[1] + r[1], t[2] = c[2] + r[2], t }, vec3.rotateZ = function(t, n, r, e) {
                var a = [],
                    c = [];
                return a[0] = n[0] - r[0], a[1] = n[1] - r[1], a[2] = n[2] - r[2], c[0] = a[0] * Math.cos(e) - a[1] * Math.sin(e), c[1] = a[0] * Math.sin(e) + a[1] * Math.cos(e), c[2] = a[2], t[0] = c[0] + r[0], t[1] = c[1] + r[1], t[2] = c[2] + r[2], t }, vec3.forEach = function() {
                var t = vec3.create();
                return function(n, r, e, a, c, u) {
                    var v, i;
                    for (r || (r = 3), e || (e = 0), i = a ? Math.min(a * r + e, n.length) : n.length, v = e; v < i; v += r) t[0] = n[v], t[1] = n[v + 1], t[2] = n[v + 2], c(t, t, u), n[v] = t[0], n[v + 1] = t[1], n[v + 2] = t[2];
                    return n } }(), vec3.angle = function(t, n) {
                var r = vec3.fromValues(t[0], t[1], t[2]),
                    e = vec3.fromValues(n[0], n[1], n[2]);
                vec3.normalize(r, r), vec3.normalize(e, e);
                var a = vec3.dot(r, e);
                return a > 1 ? 0 : Math.acos(a) }, vec3.str = function(t) {
                return "vec3(" + t[0] + ", " + t[1] + ", " + t[2] + ")" }, vec3.exactEquals = function(t, n) {
                return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] }, vec3.equals = function(t, n) {
                var r = t[0],
                    e = t[1],
                    a = t[2],
                    c = n[0],
                    u = n[1],
                    v = n[2];
                return Math.abs(r - c) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(e - u) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(u)) && Math.abs(a - v) <= glMatrix.EPSILON * Math.max(1, Math.abs(a), Math.abs(v)) }, module.exports = vec3;
        }, { "./common.js": 151 }],
        159: [function(require, module, exports) {
            var glMatrix = require("./common.js"),
                vec4 = {};
            vec4.create = function() {
                var t = new glMatrix.ARRAY_TYPE(4);
                return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t }, vec4.clone = function(t) {
                var n = new glMatrix.ARRAY_TYPE(4);
                return n[0] = t[0], n[1] = t[1], n[2] = t[2], n[3] = t[3], n }, vec4.fromValues = function(t, n, e, r) {
                var a = new glMatrix.ARRAY_TYPE(4);
                return a[0] = t, a[1] = n, a[2] = e, a[3] = r, a }, vec4.copy = function(t, n) {
                return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t }, vec4.set = function(t, n, e, r, a) {
                return t[0] = n, t[1] = e, t[2] = r, t[3] = a, t }, vec4.add = function(t, n, e) {
                return t[0] = n[0] + e[0], t[1] = n[1] + e[1], t[2] = n[2] + e[2], t[3] = n[3] + e[3], t }, vec4.subtract = function(t, n, e) {
                return t[0] = n[0] - e[0], t[1] = n[1] - e[1], t[2] = n[2] - e[2], t[3] = n[3] - e[3], t }, vec4.sub = vec4.subtract, vec4.multiply = function(t, n, e) {
                return t[0] = n[0] * e[0], t[1] = n[1] * e[1], t[2] = n[2] * e[2], t[3] = n[3] * e[3], t }, vec4.mul = vec4.multiply, vec4.divide = function(t, n, e) {
                return t[0] = n[0] / e[0], t[1] = n[1] / e[1], t[2] = n[2] / e[2], t[3] = n[3] / e[3], t }, vec4.div = vec4.divide, vec4.ceil = function(t, n) {
                return t[0] = Math.ceil(n[0]), t[1] = Math.ceil(n[1]), t[2] = Math.ceil(n[2]), t[3] = Math.ceil(n[3]), t }, vec4.floor = function(t, n) {
                return t[0] = Math.floor(n[0]), t[1] = Math.floor(n[1]), t[2] = Math.floor(n[2]), t[3] = Math.floor(n[3]), t }, vec4.min = function(t, n, e) {
                return t[0] = Math.min(n[0], e[0]), t[1] = Math.min(n[1], e[1]), t[2] = Math.min(n[2], e[2]), t[3] = Math.min(n[3], e[3]), t }, vec4.max = function(t, n, e) {
                return t[0] = Math.max(n[0], e[0]), t[1] = Math.max(n[1], e[1]), t[2] = Math.max(n[2], e[2]), t[3] = Math.max(n[3], e[3]), t }, vec4.round = function(t, n) {
                return t[0] = Math.round(n[0]), t[1] = Math.round(n[1]), t[2] = Math.round(n[2]), t[3] = Math.round(n[3]), t }, vec4.scale = function(t, n, e) {
                return t[0] = n[0] * e, t[1] = n[1] * e, t[2] = n[2] * e, t[3] = n[3] * e, t }, vec4.scaleAndAdd = function(t, n, e, r) {
                return t[0] = n[0] + e[0] * r, t[1] = n[1] + e[1] * r, t[2] = n[2] + e[2] * r, t[3] = n[3] + e[3] * r, t }, vec4.distance = function(t, n) {
                var e = n[0] - t[0],
                    r = n[1] - t[1],
                    a = n[2] - t[2],
                    c = n[3] - t[3];
                return Math.sqrt(e * e + r * r + a * a + c * c) }, vec4.dist = vec4.distance, vec4.squaredDistance = function(t, n) {
                var e = n[0] - t[0],
                    r = n[1] - t[1],
                    a = n[2] - t[2],
                    c = n[3] - t[3];
                return e * e + r * r + a * a + c * c }, vec4.sqrDist = vec4.squaredDistance, vec4.length = function(t) {
                var n = t[0],
                    e = t[1],
                    r = t[2],
                    a = t[3];
                return Math.sqrt(n * n + e * e + r * r + a * a) }, vec4.len = vec4.length, vec4.squaredLength = function(t) {
                var n = t[0],
                    e = t[1],
                    r = t[2],
                    a = t[3];
                return n * n + e * e + r * r + a * a }, vec4.sqrLen = vec4.squaredLength, vec4.negate = function(t, n) {
                return t[0] = -n[0], t[1] = -n[1], t[2] = -n[2], t[3] = -n[3], t }, vec4.inverse = function(t, n) {
                return t[0] = 1 / n[0], t[1] = 1 / n[1], t[2] = 1 / n[2], t[3] = 1 / n[3], t }, vec4.normalize = function(t, n) {
                var e = n[0],
                    r = n[1],
                    a = n[2],
                    c = n[3],
                    u = e * e + r * r + a * a + c * c;
                return u > 0 && (u = 1 / Math.sqrt(u), t[0] = e * u, t[1] = r * u, t[2] = a * u, t[3] = c * u), t }, vec4.dot = function(t, n) {
                return t[0] * n[0] + t[1] * n[1] + t[2] * n[2] + t[3] * n[3] }, vec4.lerp = function(t, n, e, r) {
                var a = n[0],
                    c = n[1],
                    u = n[2],
                    i = n[3];
                return t[0] = a + r * (e[0] - a), t[1] = c + r * (e[1] - c), t[2] = u + r * (e[2] - u), t[3] = i + r * (e[3] - i), t }, vec4.random = function(t, n) {
                return n = n || 1, t[0] = glMatrix.RANDOM(), t[1] = glMatrix.RANDOM(), t[2] = glMatrix.RANDOM(), t[3] = glMatrix.RANDOM(), vec4.normalize(t, t), vec4.scale(t, t, n), t }, vec4.transformMat4 = function(t, n, e) {
                var r = n[0],
                    a = n[1],
                    c = n[2],
                    u = n[3];
                return t[0] = e[0] * r + e[4] * a + e[8] * c + e[12] * u, t[1] = e[1] * r + e[5] * a + e[9] * c + e[13] * u, t[2] = e[2] * r + e[6] * a + e[10] * c + e[14] * u, t[3] = e[3] * r + e[7] * a + e[11] * c + e[15] * u, t }, vec4.transformQuat = function(t, n, e) {
                var r = n[0],
                    a = n[1],
                    c = n[2],
                    u = e[0],
                    i = e[1],
                    v = e[2],
                    o = e[3],
                    M = o * r + i * c - v * a,
                    h = o * a + v * r - u * c,
                    f = o * c + u * a - i * r,
                    l = -u * r - i * a - v * c;
                return t[0] = M * o + l * -u + h * -v - f * -i, t[1] = h * o + l * -i + f * -u - M * -v, t[2] = f * o + l * -v + M * -i - h * -u, t[3] = n[3], t }, vec4.forEach = function() {
                var t = vec4.create();
                return function(n, e, r, a, c, u) {
                    var i, v;
                    for (e || (e = 4), r || (r = 0), v = a ? Math.min(a * e + r, n.length) : n.length, i = r; i < v; i += e) t[0] = n[i], t[1] = n[i + 1], t[2] = n[i + 2], t[3] = n[i + 3], c(t, t, u), n[i] = t[0], n[i + 1] = t[1], n[i + 2] = t[2], n[i + 3] = t[3];
                    return n } }(), vec4.str = function(t) {
                return "vec4(" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ")" }, vec4.exactEquals = function(t, n) {
                return t[0] === n[0] && t[1] === n[1] && t[2] === n[2] && t[3] === n[3] }, vec4.equals = function(t, n) {
                var e = t[0],
                    r = t[1],
                    a = t[2],
                    c = t[3],
                    u = n[0],
                    i = n[1],
                    v = n[2],
                    o = n[3];
                return Math.abs(e - u) <= glMatrix.EPSILON * Math.max(1, Math.abs(e), Math.abs(u)) && Math.abs(r - i) <= glMatrix.EPSILON * Math.max(1, Math.abs(r), Math.abs(i)) && Math.abs(a - v) <= glMatrix.EPSILON * Math.max(1, Math.abs(a), Math.abs(v)) && Math.abs(c - o) <= glMatrix.EPSILON * Math.max(1, Math.abs(c), Math.abs(o)) }, module.exports = vec4;
        }, { "./common.js": 151 }],
        160: [function(require, module, exports) {
            "use strict";

            function GridIndex(t, r, e) {
                var s = this.cells = [];
                if (t instanceof ArrayBuffer) { this.arrayBuffer = t;
                    var i = new Int32Array(this.arrayBuffer);
                    t = i[0], r = i[1], e = i[2], this.d = r + 2 * e;
                    for (var h = 0; h < this.d * this.d; h++) {
                        var n = i[NUM_PARAMS + h],
                            o = i[NUM_PARAMS + h + 1];
                        s.push(n === o ? null : i.subarray(n, o)) }
                    var l = i[NUM_PARAMS + s.length],
                        a = i[NUM_PARAMS + s.length + 1];
                    this.keys = i.subarray(l, a), this.bboxes = i.subarray(a), this.insert = this._insertReadonly } else { this.d = r + 2 * e;
                    for (var d = 0; d < this.d * this.d; d++) s.push([]);
                    this.keys = [], this.bboxes = [] }
                this.n = r, this.extent = t, this.padding = e, this.scale = r / t, this.uid = 0;
                var f = e / r * t;
                this.min = -f, this.max = t + f }
            module.exports = GridIndex;
            var NUM_PARAMS = 3;
            GridIndex.prototype.insert = function(t, r, e, s, i) { this._forEachCell(r, e, s, i, this._insertCell, this.uid++), this.keys.push(t), this.bboxes.push(r), this.bboxes.push(e), this.bboxes.push(s), this.bboxes.push(i) }, GridIndex.prototype._insertReadonly = function() {
                throw "Cannot insert into a GridIndex created from an ArrayBuffer." }, GridIndex.prototype._insertCell = function(t, r, e, s, i, h) { this.cells[i].push(h) }, GridIndex.prototype.query = function(t, r, e, s) {
                var i = this.min,
                    h = this.max;
                if (t <= i && r <= i && h <= e && h <= s) return Array.prototype.slice.call(this.keys);
                var n = [],
                    o = {};
                return this._forEachCell(t, r, e, s, this._queryCell, n, o), n }, GridIndex.prototype._queryCell = function(t, r, e, s, i, h, n) {
                var o = this.cells[i];
                if (null !== o)
                    for (var l = this.keys, a = this.bboxes, d = 0; d < o.length; d++) {
                        var f = o[d];
                        if (void 0 === n[f]) {
                            var u = 4 * f;
                            t <= a[u + 2] && r <= a[u + 3] && e >= a[u + 0] && s >= a[u + 1] ? (n[f] = !0, h.push(l[f])) : n[f] = !1 } } }, GridIndex.prototype._forEachCell = function(t, r, e, s, i, h, n) {
                for (var o = this._convertToCellCoord(t), l = this._convertToCellCoord(r), a = this._convertToCellCoord(e), d = this._convertToCellCoord(s), f = o; f <= a; f++)
                    for (var u = l; u <= d; u++) {
                        var y = this.d * u + f;
                        if (i.call(this, t, r, e, s, y, h, n)) return } }, GridIndex.prototype._convertToCellCoord = function(t) {
                return Math.max(0, Math.min(this.d - 1, Math.floor(t * this.scale) + this.padding)) }, GridIndex.prototype.toArrayBuffer = function() {
                if (this.arrayBuffer) return this.arrayBuffer;
                for (var t = this.cells, r = NUM_PARAMS + this.cells.length + 1 + 1, e = 0, s = 0; s < this.cells.length; s++) e += this.cells[s].length;
                var i = new Int32Array(r + e + this.keys.length + this.bboxes.length);
                i[0] = this.extent, i[1] = this.n, i[2] = this.padding;
                for (var h = r, n = 0; n < t.length; n++) {
                    var o = t[n];
                    i[NUM_PARAMS + n] = h, i.set(o, h), h += o.length }
                return i[NUM_PARAMS + t.length] = h, i.set(this.keys, h), h += this.keys.length, i[NUM_PARAMS + t.length + 1] = h, i.set(this.bboxes, h), h += this.bboxes.length, i.buffer };
        }, {}],
        161: [function(require, module, exports) {
            function xyz2lab(r) {
                return r > t3 ? Math.pow(r, 1 / 3) : r / t2 + t0 }

            function lab2xyz(r) {
                return r > t1 ? r * r * r : t2 * (r - t0) }

            function xyz2rgb(r) {
                return 255 * (r <= .0031308 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055) }

            function rgb2xyz(r) {
                return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4) }

            function rgbToLab(r) {
                var t = rgb2xyz(r[0]),
                    a = rgb2xyz(r[1]),
                    n = rgb2xyz(r[2]),
                    b = xyz2lab((.4124564 * t + .3575761 * a + .1804375 * n) / Xn),
                    o = xyz2lab((.2126729 * t + .7151522 * a + .072175 * n) / Yn),
                    g = xyz2lab((.0193339 * t + .119192 * a + .9503041 * n) / Zn);
                return [116 * o - 16, 500 * (b - o), 200 * (o - g), r[3]] }

            function labToRgb(r) {
                var t = (r[0] + 16) / 116,
                    a = isNaN(r[1]) ? t : t + r[1] / 500,
                    n = isNaN(r[2]) ? t : t - r[2] / 200;
                return t = Yn * lab2xyz(t), a = Xn * lab2xyz(a), n = Zn * lab2xyz(n), [xyz2rgb(3.2404542 * a - 1.5371385 * t - .4985314 * n), xyz2rgb(-.969266 * a + 1.8760108 * t + .041556 * n), xyz2rgb(.0556434 * a - .2040259 * t + 1.0572252 * n), r[3]] }

            function rgbToHcl(r) {
                var t = rgbToLab(r),
                    a = t[0],
                    n = t[1],
                    b = t[2],
                    o = Math.atan2(b, n) * rad2deg;
                return [o < 0 ? o + 360 : o, Math.sqrt(n * n + b * b), a, r[3]] }

            function hclToRgb(r) {
                var t = r[0] * deg2rad,
                    a = r[1],
                    n = r[2];
                return labToRgb([n, Math.cos(t) * a, Math.sin(t) * a, r[3]]) }
            var Kn = 18,
                Xn = .95047,
                Yn = 1,
                Zn = 1.08883,
                t0 = 4 / 29,
                t1 = 6 / 29,
                t2 = 3 * t1 * t1,
                t3 = t1 * t1 * t1,
                deg2rad = Math.PI / 180,
                rad2deg = 180 / Math.PI;
            module.exports = { lab: { forward: rgbToLab, reverse: labToRgb }, hcl: { forward: rgbToHcl, reverse: hclToRgb } };
        }, {}],
        162: [function(require, module, exports) {
            "use strict";

            function identityFunction(t) {
                return t }

            function createFunction(t, o) {
                var n;
                if (isFunctionDefinition(t)) {
                    var e, r = t.stops && "object" == typeof t.stops[0][0],
                        i = r || void 0 !== t.property,
                        s = r || !i,
                        a = t.type || o || "exponential";
                    if ("exponential" === a) e = evaluateExponentialFunction;
                    else if ("interval" === a) e = evaluateIntervalFunction;
                    else if ("categorical" === a) e = evaluateCategoricalFunction;
                    else {
                        if ("identity" !== a) throw new Error('Unknown function type "' + a + '"');
                        e = evaluateIdentityFunction }
                    var p;
                    if (t.colorSpace && "rgb" !== t.colorSpace) {
                        if (!colorSpaces[t.colorSpace]) throw new Error("Unknown color space: " + t.colorSpace);
                        var u = colorSpaces[t.colorSpace];
                        t = JSON.parse(JSON.stringify(t));
                        for (var c = 0; c < t.stops.length; c++) t.stops[c] = [t.stops[c][0], u.forward(t.stops[c][1])];
                        p = u.reverse } else p = identityFunction;
                    if (r) {
                        var l = {},
                            f = [];
                        for (c = 0; c < t.stops.length; c++) {
                            var v = t.stops[c];
                            void 0 === l[v[0].zoom] && (l[v[0].zoom] = { zoom: v[0].zoom, type: t.type, property: t.property, stops: [] }), l[v[0].zoom].stops.push([v[0].value, v[1]]) }
                        for (var y in l) f.push([l[y].zoom, createFunction(l[y])]);
                        n = function(o, n) {
                            return p(evaluateExponentialFunction({ stops: f, base: t.base }, o)(o, n)) }, n.isFeatureConstant = !1, n.isZoomConstant = !1 } else s ? (n = function(o) {
                        return p(e(t, o)) }, n.isFeatureConstant = !0, n.isZoomConstant = !1) : (n = function(o, n) {
                        return p(e(t, n[t.property])) }, n.isFeatureConstant = !1, n.isZoomConstant = !0) } else n = function() {
                    return t }, n.isFeatureConstant = !0, n.isZoomConstant = !0;
                return n }

            function evaluateCategoricalFunction(t, o) {
                for (var n = 0; n < t.stops.length; n++)
                    if (o === t.stops[n][0]) return t.stops[n][1];
                return t.stops[0][1] }

            function evaluateIntervalFunction(t, o) {
                for (var n = 0; n < t.stops.length && !(o < t.stops[n][0]); n++);
                return t.stops[Math.max(n - 1, 0)][1] }

            function evaluateExponentialFunction(t, o) {
                for (var n = void 0 !== t.base ? t.base : 1, e = 0;;) {
                    if (e >= t.stops.length) break;
                    if (o <= t.stops[e][0]) break;
                    e++ }
                return 0 === e ? t.stops[e][1] : e === t.stops.length ? t.stops[e - 1][1] : interpolate(o, n, t.stops[e - 1][0], t.stops[e][0], t.stops[e - 1][1], t.stops[e][1]) }

            function evaluateIdentityFunction(t, o) {
                return o }

            function interpolate(t, o, n, e, r, i) {
                return "function" == typeof r ? function() {
                    var s = r.apply(void 0, arguments),
                        a = i.apply(void 0, arguments);
                    return interpolate(t, o, n, e, s, a) } : r.length ? interpolateArray(t, o, n, e, r, i) : interpolateNumber(t, o, n, e, r, i) }

            function interpolateNumber(t, o, n, e, r, i) {
                var s, a = e - n,
                    p = t - n;
                return s = 1 === o ? p / a : (Math.pow(o, p) - 1) / (Math.pow(o, a) - 1), r * (1 - s) + i * s }

            function interpolateArray(t, o, n, e, r, i) {
                for (var s = [], a = 0; a < r.length; a++) s[a] = interpolateNumber(t, o, n, e, r[a], i[a]);
                return s }

            function isFunctionDefinition(t) {
                return "object" == typeof t && (t.stops || "identity" === t.type) }
            var colorSpaces = require("./color_spaces");
            module.exports.isFunctionDefinition = isFunctionDefinition, module.exports.interpolated = function(t) {
                return createFunction(t, "exponential") }, module.exports["piecewise-constant"] = function(t) {
                return createFunction(t, "interval") };
        }, { "./color_spaces": 161 }],
        163: [function(require, module, exports) {
            var path = require("path");
            module.exports = {
                circle: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_extrude;\nvarying lowp float v_antialiasblur;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    float t = smoothstep(1.0 - max(blur, v_antialiasblur), 1.0, length(v_extrude));\n    gl_FragColor = color * (1.0 - t) * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform bool u_scale_with_map;\nuniform vec2 u_extrude_scale;\nuniform float u_devicepixelratio;\n\nattribute vec2 a_pos;\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define mediump float radius\n#pragma mapbox: define lowp float blur\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_extrude;\nvarying lowp float v_antialiasblur;\n\nvoid main(void) {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize mediump float radius\n    #pragma mapbox: initialize lowp float blur\n    #pragma mapbox: initialize lowp float opacity\n\n    // unencode the extrusion vector that we snuck into the a_pos vector\n    v_extrude = vec2(mod(a_pos, 2.0) * 2.0 - 1.0);\n\n    vec2 extrude = v_extrude * radius * u_extrude_scale;\n    // multiply a_pos by 0.5, since we had it * 2 in order to sneak\n    // in extrusion data\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5), 0, 1);\n\n    if (u_scale_with_map) {\n        gl_Position.xy += extrude;\n    } else {\n        gl_Position.xy += extrude * gl_Position.w;\n    }\n\n    // This is a minimum blur distance that serves as a faux-antialiasing for\n    // the circle. since blur is a ratio of the circle's size and the intent is\n    // to keep the blur at roughly 1px, the two are inversely related.\n    v_antialiasblur = 1.0 / u_devicepixelratio / radius;\n}\n" },
                collisionBox: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform float u_zoom;\nuniform float u_maxzoom;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n\n    float alpha = 0.5;\n\n    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0) * alpha;\n\n    if (v_placement_zoom > u_zoom) {\n        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0) * alpha;\n    }\n\n    if (u_zoom >= v_max_zoom) {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) * alpha * 0.25;\n    }\n\n    if (v_placement_zoom >= u_maxzoom) {\n        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0) * alpha * 0.2;\n    }\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nattribute vec2 a_pos;\nattribute vec2 a_extrude;\nattribute vec2 a_data;\n\nuniform mat4 u_matrix;\nuniform float u_scale;\n\nvarying float v_max_zoom;\nvarying float v_placement_zoom;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos + a_extrude / u_scale, 0.0, 1.0);\n\n    v_max_zoom = a_data.x;\n    v_placement_zoom = a_data.y;\n}\n" },
                debug: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform lowp vec4 u_color;\n\nvoid main() {\n    gl_FragColor = u_color;\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, step(32767.0, a_pos.x), 1);\n}\n" },
                fill: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_FragColor = color * opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\n\n#pragma mapbox: define lowp vec4 color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n}\n" },
                fillOutline: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n#pragma mapbox: define lowp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvarying vec2 v_pos;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n    gl_FragColor = outline_color * (alpha * opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos;\n\n#pragma mapbox: define lowp vec4 outline_color\n#pragma mapbox: define lowp float opacity\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 outline_color\n    #pragma mapbox: initialize lowp float opacity\n\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n" },
                fillOutlinePattern: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform float u_opacity;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\nvoid main() {\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    // find distance to outline for alpha interpolation\n\n    float dist = length(v_pos - gl_FragCoord.xy);\n    float alpha = smoothstep(1.0, 0.0, dist);\n    \n\n    gl_FragColor = mix(color1, color2, u_mix) * alpha * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nuniform mat4 u_matrix;\nuniform vec2 u_world;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    vec2 scaled_size_a = u_scale_a * u_pattern_size_a;\n    vec2 scaled_size_b = u_scale_b * u_pattern_size_b;\n\n    // the correct offset needs to be calculated.\n    //\n    // The offset depends on how many pixels are between the world origin and\n    // the edge of the tile:\n    // vec2 offset = mod(pixel_coord, size)\n    //\n    // At high zoom levels there are a ton of pixels between the world origin\n    // and the edge of the tile. The glsl spec only guarantees 16 bits of\n    // precision for highp floats. We need more than that.\n    //\n    // The pixel_coord is passed in as two 16 bit values:\n    // pixel_coord_upper = floor(pixel_coord / 2^16)\n    // pixel_coord_lower = mod(pixel_coord, 2^16)\n    //\n    // The offset is calculated in a series of steps that should preserve this precision:\n    vec2 offset_a = mod(mod(mod(u_pixel_coord_upper, scaled_size_a) * 256.0, scaled_size_a) * 256.0 + u_pixel_coord_lower, scaled_size_a);\n    vec2 offset_b = mod(mod(mod(u_pixel_coord_upper, scaled_size_b) * 256.0, scaled_size_b) * 256.0 + u_pixel_coord_lower, scaled_size_b);\n\n    v_pos_a = (u_tile_units_to_pixels * a_pos + offset_a) / scaled_size_a;\n    v_pos_b = (u_tile_units_to_pixels * a_pos + offset_b) / scaled_size_b;\n\n    v_pos = (gl_Position.xy / gl_Position.w + 1.0) / 2.0 * u_world;\n}\n" },
                fillPattern: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform float u_opacity;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    gl_FragColor = mix(color1, color2, u_mix) * u_opacity;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\n\nattribute vec2 a_pos;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    vec2 scaled_size_a = u_scale_a * u_pattern_size_a;\n    vec2 scaled_size_b = u_scale_b * u_pattern_size_b;\n\n    // the correct offset needs to be calculated.\n    //\n    // The offset depends on how many pixels are between the world origin and\n    // the edge of the tile:\n    // vec2 offset = mod(pixel_coord, size)\n    //\n    // At high zoom levels there are a ton of pixels between the world origin\n    // and the edge of the tile. The glsl spec only guarantees 16 bits of\n    // precision for highp floats. We need more than that.\n    //\n    // The pixel_coord is passed in as two 16 bit values:\n    // pixel_coord_upper = floor(pixel_coord / 2^16)\n    // pixel_coord_lower = mod(pixel_coord, 2^16)\n    //\n    // The offset is calculated in a series of steps that should preserve this precision:\n    vec2 offset_a = mod(mod(mod(u_pixel_coord_upper, scaled_size_a) * 256.0, scaled_size_a) * 256.0 + u_pixel_coord_lower, scaled_size_a);\n    vec2 offset_b = mod(mod(mod(u_pixel_coord_upper, scaled_size_b) * 256.0, scaled_size_b) * 256.0 + u_pixel_coord_lower, scaled_size_b);\n\n    v_pos_a = (u_tile_units_to_pixels * a_pos + offset_a) / scaled_size_a;\n    v_pos_b = (u_tile_units_to_pixels * a_pos + offset_b) / scaled_size_b;\n}\n" },
                fillExtrude: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nvarying vec4 v_color;\n#ifdef MAPBOX_GL_JS\n#pragma mapbox: define lowp float minH\n#pragma mapbox: define lowp float maxH\n#endif\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n#ifdef MAPBOX_GL_JS\n    #pragma mapbox: initialize lowp float minH\n    #pragma mapbox: initialize lowp float maxH\n#endif\n    #pragma mapbox: initialize lowp vec4 color\n\n    gl_FragColor = v_color;\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\nuniform lowp vec4 u_outline_color;\n\nattribute vec2 a_pos;\nattribute vec3 a_normal;\nattribute float a_edgedistance;\n\nvarying vec4 v_color;\n\n#ifndef MAPBOX_GL_JS\nattribute float minH;\nattribute float maxH;\n#else\n#pragma mapbox: define lowp float minH\n#pragma mapbox: define lowp float maxH\n#endif\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n#ifdef MAPBOX_GL_JS\n    #pragma mapbox: initialize lowp float minH\n    #pragma mapbox: initialize lowp float maxH\n#endif\n    #pragma mapbox: initialize lowp vec4 color\n\n    float ed = a_edgedistance; // use each attrib in order to not trip a VAO assert\n    float t = mod(a_normal.x, 2.0);\n\n    gl_Position = u_matrix * vec4(a_pos, t > 0.0 ? maxH : minH, 1);\n\n#ifdef OUTLINE\n    color = u_outline_color;\n#endif\n\n    // Relative luminance (how dark/bright is the surface color?)\n    float colorvalue = color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722;\n\n    v_color = vec4(0.0, 0.0, 0.0, 1.0);\n\n    // Add slight ambient lighting so no extrusions are totally black\n    vec4 ambientlight = vec4(0.03, 0.03, 0.03, 1.0);\n    color += ambientlight;\n\n    // Calculate cos(theta), where theta is the angle between surface normal and diffuse light ray\n    float directional = clamp(dot(a_normal / 16384.0, u_lightpos), 0.0, 1.0);\n\n    // Adjust directional so that\n    // the range of values for highlight/shading is narrower\n    // with lower light intensity\n    // and with lighter/brighter surface colors\n    directional = mix((1.0 - u_lightintensity), max((1.0 - colorvalue + u_lightintensity), 1.0), directional);\n\n    // Add gradient along z axis of side surfaces\n    if (a_normal.y != 0.0) {\n        directional *= clamp((t + minH) * pow(maxH / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    // Assign final color based on surface + ambient light color, diffuse light directional, and light color\n    // with lower bounds adjusted to hue of light\n    // so that shading is tinted with the complementary (opposite) color to the light color\n    v_color.r += clamp(color.r * directional * u_lightcolor.r, mix(0.0, 0.3, 1.0 - u_lightcolor.r), 1.0);\n    v_color.g += clamp(color.g * directional * u_lightcolor.g, mix(0.0, 0.3, 1.0 - u_lightcolor.g), 1.0);\n    v_color.b += clamp(color.b * directional * u_lightcolor.b, mix(0.0, 0.3, 1.0 - u_lightcolor.b), 1.0);\n}\n" },
                fillExtrudePattern: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_mix;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\n\n#ifdef MAPBOX_GL_JS\n#pragma mapbox: define lowp float minH\n#pragma mapbox: define lowp float maxH\n#endif\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n#ifdef MAPBOX_GL_JS\n    #pragma mapbox: initialize lowp float minH\n    #pragma mapbox: initialize lowp float maxH\n#endif\n    #pragma mapbox: initialize lowp vec4 color\n\n    vec2 imagecoord = mod(v_pos_a, 1.0);\n    vec2 pos = mix(u_pattern_tl_a, u_pattern_br_a, imagecoord);\n    vec4 color1 = texture2D(u_image, pos);\n\n    vec2 imagecoord_b = mod(v_pos_b, 1.0);\n    vec2 pos2 = mix(u_pattern_tl_b, u_pattern_br_b, imagecoord_b);\n    vec4 color2 = texture2D(u_image, pos2);\n\n    vec4 mixedColor = mix(color1, color2, u_mix);\n\n    gl_FragColor = mixedColor * v_lighting;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pixel_coord_upper;\nuniform vec2 u_pixel_coord_lower;\nuniform float u_scale_a;\nuniform float u_scale_b;\nuniform float u_tile_units_to_pixels;\nuniform float u_height_factor;\n\nuniform vec3 u_lightcolor;\nuniform lowp vec3 u_lightpos;\nuniform lowp float u_lightintensity;\n\nattribute vec2 a_pos;\nattribute vec3 a_normal;\nattribute float a_edgedistance;\n\nvarying vec2 v_pos_a;\nvarying vec2 v_pos_b;\nvarying vec4 v_lighting;\nvarying float v_directional;\n\n#ifndef MAPBOX_GL_JS\nattribute float minH;\nattribute float maxH;\n#else\n#pragma mapbox: define lowp float minH\n#pragma mapbox: define lowp float maxH\n#endif\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n#ifdef MAPBOX_GL_JS\n    #pragma mapbox: initialize lowp float minH\n    #pragma mapbox: initialize lowp float maxH\n#endif\n    #pragma mapbox: initialize lowp vec4 color\n\n    float t = mod(a_normal.x, 2.0);\n    float z = t > 0.0 ? maxH : minH;\n\n    gl_Position = u_matrix * vec4(a_pos, z, 1);\n\n    vec2 scaled_size_a = u_scale_a * u_pattern_size_a;\n    vec2 scaled_size_b = u_scale_b * u_pattern_size_b;\n\n    // the following offset calculation is duplicated from the regular pattern shader:\n    vec2 offset_a = mod(mod(mod(u_pixel_coord_upper, scaled_size_a) * 256.0, scaled_size_a) * 256.0 + u_pixel_coord_lower, scaled_size_a);\n    vec2 offset_b = mod(mod(mod(u_pixel_coord_upper, scaled_size_b) * 256.0, scaled_size_b) * 256.0 + u_pixel_coord_lower, scaled_size_b);\n\n    if (a_normal.x == 1.0 && a_normal.y == 0.0 && a_normal.z == 16384.0) {\n        // extrusion top\n        v_pos_a = (u_tile_units_to_pixels * a_pos + offset_a) / scaled_size_a;\n        v_pos_b = (u_tile_units_to_pixels * a_pos + offset_b) / scaled_size_b;\n    } else {\n        // extrusion side\n        float hf = z * u_height_factor;\n\n        v_pos_a = (u_tile_units_to_pixels * vec2(a_edgedistance, hf) + offset_a) / scaled_size_a;\n        v_pos_b = (u_tile_units_to_pixels * vec2(a_edgedistance, hf) + offset_b) / scaled_size_b;\n    }\n\n    v_lighting = vec4(0.0, 0.0, 0.0, 1.0);\n    float directional = clamp(dot(a_normal / 16383.0, u_lightpos), 0.0, 1.0);\n    directional = mix((1.0 - u_lightintensity), max((0.5 + u_lightintensity), 1.0), directional);\n\n    if (a_normal.y != 0.0) {\n        directional *= clamp((t + minH) * pow(maxH / 150.0, 0.5), mix(0.7, 0.98, 1.0 - u_lightintensity), 1.0);\n    }\n\n    v_lighting.rgb += clamp(directional * u_lightcolor, mix(vec3(0.0), vec3(0.3), 1.0 - u_lightcolor), vec3(1.0));\n}\n" },
                fillExtrudeTexture: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform sampler2D u_texture;\nuniform float u_opacity;\n\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_FragColor = texture2D(u_texture, v_pos) * u_opacity;\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform int u_xdim;\nuniform int u_ydim;\nattribute vec2 a_pos;\nvarying vec2 v_pos;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n\n    v_pos.x = a_pos.x / float(u_xdim);\n    v_pos.y = 1.0 - a_pos.y / float(u_ydim);\n}\n" },
                line: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform lowp float u_opacity;\nuniform float u_blur;\n\n#pragma mapbox: define lowp vec4 color\n\nvarying vec2 v_linewidth;\nvarying vec2 v_normal;\nvarying float v_gamma_scale;\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    gl_FragColor = color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform mediump float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\nuniform mediump float u_blur;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n" },
                linePattern: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform float u_blur;\n\nuniform vec2 u_pattern_size_a;\nuniform vec2 u_pattern_size_b;\nuniform vec2 u_pattern_tl_a;\nuniform vec2 u_pattern_br_a;\nuniform vec2 u_pattern_tl_b;\nuniform vec2 u_pattern_br_b;\nuniform float u_fade;\nuniform float u_opacity;\n\nuniform sampler2D u_image;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float x_a = mod(v_linesofar / u_pattern_size_a.x, 1.0);\n    float x_b = mod(v_linesofar / u_pattern_size_b.x, 1.0);\n    float y_a = 0.5 + (v_normal.y * v_linewidth.s / u_pattern_size_a.y);\n    float y_b = 0.5 + (v_normal.y * v_linewidth.s / u_pattern_size_b.y);\n    vec2 pos_a = mix(u_pattern_tl_a, u_pattern_br_a, vec2(x_a, y_a));\n    vec2 pos_b = mix(u_pattern_tl_b, u_pattern_br_b, vec2(x_b, y_b));\n\n    vec4 color = mix(texture2D(u_image, pos_a), texture2D(u_image, pos_b), u_fade);\n\n    alpha *= u_opacity;\n\n    gl_FragColor = color * alpha;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform mediump float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying float v_linesofar;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n    v_linesofar = a_linesofar;\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n" },
                lineSDF: {
                    fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform lowp float u_opacity;\n\nuniform float u_blur;\nuniform sampler2D u_image;\nuniform float u_sdfgamma;\nuniform float u_mix;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    // Calculate the distance of the pixel from the line in pixels.\n    float dist = length(v_normal) * v_linewidth.s;\n\n    // Calculate the antialiasing fade factor. This is either when fading in\n    // the line in case of an offset line (v_linewidth.t) or when fading out\n    // (v_linewidth.s)\n    float blur = u_blur * v_gamma_scale;\n    float alpha = clamp(min(dist - (v_linewidth.t - blur), v_linewidth.s - dist) / blur, 0.0, 1.0);\n\n    float sdfdist_a = texture2D(u_image, v_tex_a).a;\n    float sdfdist_b = texture2D(u_image, v_tex_b).a;\n    float sdfdist = mix(sdfdist_a, sdfdist_b, u_mix);\n    alpha *= smoothstep(0.5 - u_sdfgamma, 0.5 + u_sdfgamma, sdfdist);\n\n    gl_FragColor = color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n",
                    vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\n// floor(127 / 2) == 63.0\n// the maximum allowed miter limit is 2.0 at the moment. the extrude normal is\n// stored in a byte (-128..127). we scale regular normals up to length 63, but\n// there are also \"special\" normals that have a bigger length (of up to 126 in\n// this case).\n// #define scale 63.0\n#define scale 0.015873016\n\n// We scale the distance before adding it to the buffers so that we can store\n// long distances for long segments. Use this value to unscale the distance.\n#define LINE_DISTANCE_SCALE 2.0\n\nattribute vec2 a_pos;\nattribute vec4 a_data;\n\nuniform mat4 u_matrix;\nuniform mediump float u_ratio;\nuniform mediump float u_linewidth;\nuniform mediump float u_gapwidth;\nuniform mediump float u_antialiasing;\nuniform vec2 u_patternscale_a;\nuniform float u_tex_y_a;\nuniform vec2 u_patternscale_b;\nuniform float u_tex_y_b;\nuniform float u_extra;\nuniform mat2 u_antialiasingmatrix;\nuniform mediump float u_offset;\n\nvarying vec2 v_normal;\nvarying vec2 v_linewidth;\nvarying vec2 v_tex_a;\nvarying vec2 v_tex_b;\nvarying float v_gamma_scale;\n\n#pragma mapbox: define lowp vec4 color\n\nvoid main() {\n    #pragma mapbox: initialize lowp vec4 color\n\n    vec2 a_extrude = a_data.xy - 128.0;\n    float a_direction = mod(a_data.z, 4.0) - 1.0;\n    float a_linesofar = (floor(a_data.z / 4.0) + a_data.w * 64.0) * LINE_DISTANCE_SCALE;\n\n    // We store the texture normals in the most insignificant bit\n    // transform y so that 0 => -1 and 1 => 1\n    // In the texture normal, x is 0 if the normal points straight up/down and 1 if it's a round cap\n    // y is 1 if the normal points up, and -1 if it points down\n    mediump vec2 normal = mod(a_pos, 2.0);\n    normal.y = sign(normal.y - 0.5);\n    v_normal = normal;\n\n    float inset = u_gapwidth + (u_gapwidth > 0.0 ? u_antialiasing : 0.0);\n    float outset = u_gapwidth + u_linewidth * (u_gapwidth > 0.0 ? 2.0 : 1.0) + u_antialiasing;\n\n    // Scale the extrusion vector down to a normal and then up by the line width\n    // of this vertex.\n    mediump vec2 dist = outset * a_extrude * scale;\n\n    // Calculate the offset when drawing a line that is to the side of the actual line.\n    // We do this by creating a vector that points towards the extrude, but rotate\n    // it when we're drawing round end points (a_direction = -1 or 1) since their\n    // extrude vector points in another direction.\n    mediump float u = 0.5 * a_direction;\n    mediump float t = 1.0 - abs(u);\n    mediump vec2 offset = u_offset * a_extrude * scale * normal.y * mat2(t, -u, u, t);\n\n    // Remove the texture normal bit of the position before scaling it with the\n    // model/view matrix.\n    gl_Position = u_matrix * vec4(floor(a_pos * 0.5) + (offset + dist) / u_ratio, 0.0, 1.0);\n\n    v_tex_a = vec2(a_linesofar * u_patternscale_a.x, normal.y * u_patternscale_a.y + u_tex_y_a);\n    v_tex_b = vec2(a_linesofar * u_patternscale_b.x, normal.y * u_patternscale_b.y + u_tex_y_b);\n\n    // position of y on the screen\n    float y = gl_Position.y / gl_Position.w;\n\n    // how much features are squished in the y direction by the tilt\n    float squish_scale = length(a_extrude) / length(u_antialiasingmatrix * a_extrude);\n\n    // how much features are squished in all directions by the perspectiveness\n    float perspective_scale = 1.0 / (1.0 - min(y * u_extra, 0.9));\n\n    v_linewidth = vec2(outset, inset);\n    v_gamma_scale = perspective_scale * squish_scale;\n}\n"
                },
                raster: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform float u_opacity0;\nuniform float u_opacity1;\nuniform sampler2D u_image0;\nuniform sampler2D u_image1;\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nuniform float u_brightness_low;\nuniform float u_brightness_high;\n\nuniform float u_saturation_factor;\nuniform float u_contrast_factor;\nuniform vec3 u_spin_weights;\n\nvoid main() {\n\n    // read and cross-fade colors from the main and parent tiles\n    vec4 color0 = texture2D(u_image0, v_pos0);\n    vec4 color1 = texture2D(u_image1, v_pos1);\n    vec4 color = color0 * u_opacity0 + color1 * u_opacity1;\n    vec3 rgb = color.rgb;\n\n    // spin\n    rgb = vec3(\n        dot(rgb, u_spin_weights.xyz),\n        dot(rgb, u_spin_weights.zxy),\n        dot(rgb, u_spin_weights.yzx));\n\n    // saturation\n    float average = (color.r + color.g + color.b) / 3.0;\n    rgb += (average - rgb) * u_saturation_factor;\n\n    // contrast\n    rgb = (rgb - 0.5) * u_contrast_factor + 0.5;\n\n    // brightness\n    vec3 u_high_vec = vec3(u_brightness_low, u_brightness_low, u_brightness_low);\n    vec3 u_low_vec = vec3(u_brightness_high, u_brightness_high, u_brightness_high);\n\n    gl_FragColor = vec4(mix(u_high_vec, u_low_vec, rgb), color.a);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform mat4 u_matrix;\nuniform vec2 u_tl_parent;\nuniform float u_scale_parent;\nuniform float u_buffer_scale;\n\nattribute vec2 a_pos;\nattribute vec2 a_texture_pos;\n\nvarying vec2 v_pos0;\nvarying vec2 v_pos1;\n\nvoid main() {\n    gl_Position = u_matrix * vec4(a_pos, 0, 1);\n    v_pos0 = (((a_texture_pos / 32767.0) - 0.5) / u_buffer_scale ) + 0.5;\n    v_pos1 = (v_pos0 * u_scale_parent) + u_tl_parent;\n}\n" },
                symbolIcon: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform sampler2D u_texture;\nuniform sampler2D u_fadetexture;\nuniform lowp float u_opacity;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\n\nvoid main() {\n    lowp float alpha = texture2D(u_fadetexture, v_fade_tex).a * u_opacity;\n    gl_FragColor = texture2D(u_texture, v_tex) * alpha;\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec2 a_texture_pos;\nattribute vec4 a_data;\n\n\n// matrix is for the vertex position.\nuniform mat4 u_matrix;\n\nuniform mediump float u_zoom;\nuniform bool u_rotate_with_map;\nuniform vec2 u_extrude_scale;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\n\nvoid main() {\n    vec2 a_tex = a_texture_pos.xy;\n    mediump float a_labelminzoom = a_data[0];\n    mediump vec2 a_zoom = a_data.pq;\n    mediump float a_minzoom = a_zoom[0];\n    mediump float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    mediump float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    vec2 extrude = u_extrude_scale * (a_offset / 64.0);\n    if (u_rotate_with_map) {\n        gl_Position = u_matrix * vec4(a_pos + extrude, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    } else {\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n    }\n\n    v_tex = a_tex / u_texsize;\n    v_fade_tex = vec2(a_labelminzoom / 255.0, 0.0);\n}\n" },
                symbolSDF: { fragmentSource: "#ifdef GL_ES\nprecision mediump float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nuniform sampler2D u_texture;\nuniform sampler2D u_fadetexture;\nuniform lowp vec4 u_color;\nuniform lowp float u_opacity;\nuniform lowp float u_buffer;\nuniform lowp float u_gamma;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\nvarying float v_gamma_scale;\n\nvoid main() {\n    lowp float dist = texture2D(u_texture, v_tex).a;\n    lowp float fade_alpha = texture2D(u_fadetexture, v_fade_tex).a;\n    lowp float gamma = u_gamma * v_gamma_scale;\n    lowp float alpha = smoothstep(u_buffer - gamma, u_buffer + gamma, dist) * fade_alpha;\n\n    gl_FragColor = u_color * (alpha * u_opacity);\n\n#ifdef OVERDRAW_INSPECTOR\n    gl_FragColor = vec4(1.0);\n#endif\n}\n", vertexSource: "#ifdef GL_ES\nprecision highp float;\n#else\n#define lowp\n#define mediump\n#define highp\n#endif\n\nconst float PI = 3.141592653589793;\n\nattribute vec2 a_pos;\nattribute vec2 a_offset;\nattribute vec2 a_texture_pos;\nattribute vec4 a_data;\n\n\n// matrix is for the vertex position.\nuniform mat4 u_matrix;\n\nuniform mediump float u_zoom;\nuniform bool u_rotate_with_map;\nuniform bool u_pitch_with_map;\nuniform mediump float u_pitch;\nuniform mediump float u_bearing;\nuniform mediump float u_aspect_ratio;\nuniform vec2 u_extrude_scale;\n\nuniform vec2 u_texsize;\n\nvarying vec2 v_tex;\nvarying vec2 v_fade_tex;\nvarying float v_gamma_scale;\n\nvoid main() {\n    vec2 a_tex = a_texture_pos.xy;\n    mediump float a_labelminzoom = a_data[0];\n    mediump vec2 a_zoom = a_data.pq;\n    mediump float a_minzoom = a_zoom[0];\n    mediump float a_maxzoom = a_zoom[1];\n\n    // u_zoom is the current zoom level adjusted for the change in font size\n    mediump float z = 2.0 - step(a_minzoom, u_zoom) - (1.0 - step(a_maxzoom, u_zoom));\n\n    // pitch-alignment: map\n    // rotation-alignment: map | viewport\n    if (u_pitch_with_map) {\n        lowp float angle = u_rotate_with_map ? (a_data[1] / 256.0 * 2.0 * PI) : u_bearing;\n        lowp float asin = sin(angle);\n        lowp float acos = cos(angle);\n        mat2 RotationMatrix = mat2(acos, asin, -1.0 * asin, acos);\n        vec2 offset = RotationMatrix * a_offset;\n        vec2 extrude = u_extrude_scale * (offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos + extrude, 0, 1);\n        gl_Position.z += z * gl_Position.w;\n    // pitch-alignment: viewport\n    // rotation-alignment: map\n    } else if (u_rotate_with_map) {\n        // foreshortening factor to apply on pitched maps\n        // as a label goes from horizontal <=> vertical in angle\n        // it goes from 0% foreshortening to up to around 70% foreshortening\n        lowp float pitchfactor = 1.0 - cos(u_pitch * sin(u_pitch * 0.75));\n\n        lowp float lineangle = a_data[1] / 256.0 * 2.0 * PI;\n\n        // use the lineangle to position points a,b along the line\n        // project the points and calculate the label angle in projected space\n        // this calculation allows labels to be rendered unskewed on pitched maps\n        vec4 a = u_matrix * vec4(a_pos, 0, 1);\n        vec4 b = u_matrix * vec4(a_pos + vec2(cos(lineangle),sin(lineangle)), 0, 1);\n        lowp float angle = atan((b[1]/b[3] - a[1]/a[3])/u_aspect_ratio, b[0]/b[3] - a[0]/a[3]);\n        lowp float asin = sin(angle);\n        lowp float acos = cos(angle);\n        mat2 RotationMatrix = mat2(acos, -1.0 * asin, asin, acos);\n\n        vec2 offset = RotationMatrix * (vec2((1.0-pitchfactor)+(pitchfactor*cos(angle*2.0)), 1.0) * a_offset);\n        vec2 extrude = u_extrude_scale * (offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n        gl_Position.z += z * gl_Position.w;\n    // pitch-alignment: viewport\n    // rotation-alignment: viewport\n    } else {\n        vec2 extrude = u_extrude_scale * (a_offset / 64.0);\n        gl_Position = u_matrix * vec4(a_pos, 0, 1) + vec4(extrude, 0, 0);\n    }\n\n    v_gamma_scale = (gl_Position.w - 0.5);\n\n    v_tex = a_tex / u_texsize;\n    v_fade_tex = vec2(a_labelminzoom / 255.0, 0.0);\n}\n" }
            }, module.exports.util = "float evaluate_zoom_function_1(const vec4 values, const float t) {\n    if (t < 1.0) {\n        return mix(values[0], values[1], t);\n    } else if (t < 2.0) {\n        return mix(values[1], values[2], t - 1.0);\n    } else {\n        return mix(values[2], values[3], t - 2.0);\n    }\n}\nvec4 evaluate_zoom_function_4(const vec4 value0, const vec4 value1, const vec4 value2, const vec4 value3, const float t) {\n    if (t < 1.0) {\n        return mix(value0, value1, t);\n    } else if (t < 2.0) {\n        return mix(value1, value2, t - 1.0);\n    } else {\n        return mix(value2, value3, t - 2.0);\n    }\n}\n";
        }, { "path": 125 }],
        164: [function(require, module, exports) {
            "use strict";

            function ValidationError(r, i) { this.message = (r ? r + ": " : "") + format.apply(format, Array.prototype.slice.call(arguments, 2)), null !== i && void 0 !== i && i.__line__ && (this.line = i.__line__) }
            var format = require("util").format;
            module.exports = ValidationError;
        }, { "util": 135 }],
        165: [function(require, module, exports) {
            "use strict";
            module.exports = function(r) {
                for (var t = 1; t < arguments.length; t++) {
                    var e = arguments[t];
                    for (var n in e) r[n] = e[n] }
                return r };
        }, {}],
        166: [function(require, module, exports) {
            "use strict";
            module.exports = function(n) {
                return n instanceof Number ? "number" : n instanceof String ? "string" : n instanceof Boolean ? "boolean" : Array.isArray(n) ? "array" : null === n ? "null" : typeof n };
        }, {}],
        167: [function(require, module, exports) {
            "use strict";
            module.exports = function(n) {
                return n instanceof Number || n instanceof String || n instanceof Boolean ? n.valueOf() : n };
        }, {}],
        168: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type"),
                extend = require("../util/extend");
            module.exports = function(e) {
                var r = require("./validate_function"),
                    t = require("./validate_object"),
                    a = { "*": function() {
                            return [] }, array: require("./validate_array"), boolean: require("./validate_boolean"), number: require("./validate_number"), color: require("./validate_color"), constants: require("./validate_constants"), enum: require("./validate_enum"), filter: require("./validate_filter"), function: require("./validate_function"), layer: require("./validate_layer"), object: require("./validate_object"), source: require("./validate_source"), string: require("./validate_string") },
                    i = e.value,
                    n = e.valueSpec,
                    u = e.key,
                    o = e.styleSpec,
                    l = e.style;
                if ("string" === getType(i) && "@" === i[0]) {
                    if (o.$version > 7) return [new ValidationError(u, i, "constants have been deprecated as of v8")];
                    if (!(i in l.constants)) return [new ValidationError(u, i, 'constant "%s" not found', i)];
                    e = extend({}, e, { value: l.constants[i] }) }
                return n.function && "object" === getType(i) ? r(e) : n.type && a[n.type] ? a[n.type](e) : t(extend({}, e, { valueSpec: n.type ? o[n.type] : n })) };
        }, { "../error/validation_error": 164, "../util/extend": 165, "../util/get_type": 166, "./validate_array": 169, "./validate_boolean": 170, "./validate_color": 171, "./validate_constants": 172, "./validate_enum": 173, "./validate_filter": 174, "./validate_function": 175, "./validate_layer": 177, "./validate_number": 180, "./validate_object": 181, "./validate_source": 183, "./validate_string": 184 }],
        169: [function(require, module, exports) {
            "use strict";
            var getType = require("../util/get_type"),
                validate = require("./validate"),
                ValidationError = require("../error/validation_error");
            module.exports = function(e) {
                var r = e.value,
                    t = e.valueSpec,
                    a = e.style,
                    n = e.styleSpec,
                    l = e.key,
                    i = e.arrayElementValidator || validate;
                if ("array" !== getType(r)) return [new ValidationError(l, r, "array expected, %s found", getType(r))];
                if (t.length && r.length !== t.length) return [new ValidationError(l, r, "array length %d expected, length %d found", t.length, r.length)];
                if (t["min-length"] && r.length < t["min-length"]) return [new ValidationError(l, r, "array length at least %d expected, length %d found", t["min-length"], r.length)];
                var o = { type: t.value };
                n.$version < 7 && (o.function = t.function), "object" === getType(t.value) && (o = t.value);
                for (var u = [], d = 0; d < r.length; d++) u = u.concat(i({ array: r, arrayIndex: d, value: r[d], valueSpec: o, style: a, styleSpec: n, key: l + "[" + d + "]" }));
                return u };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "./validate": 168 }],
        170: [function(require, module, exports) {
            "use strict";
            var getType = require("../util/get_type"),
                ValidationError = require("../error/validation_error");
            module.exports = function(e) {
                var r = e.value,
                    o = e.key,
                    t = getType(r);
                return "boolean" !== t ? [new ValidationError(o, r, "boolean expected, %s found", t)] : [] };
        }, { "../error/validation_error": 164, "../util/get_type": 166 }],
        171: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type"),
                parseCSSColor = require("csscolorparser").parseCSSColor;
            module.exports = function(r) {
                var e = r.key,
                    o = r.value,
                    t = getType(o);
                return "string" !== t ? [new ValidationError(e, o, "color expected, %s found", t)] : null === parseCSSColor(o) ? [new ValidationError(e, o, 'color expected, "%s" found', o)] : [] };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "csscolorparser": 136 }],
        172: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type");
            module.exports = function(r) {
                var e = r.key,
                    t = r.value,
                    a = r.styleSpec;
                if (a.$version > 7) return t ? [new ValidationError(e, t, "constants have been deprecated as of v8")] : [];
                var o = getType(t);
                if ("object" !== o) return [new ValidationError(e, t, "object expected, %s found", o)];
                var n = [];
                for (var i in t) "@" !== i[0] && n.push(new ValidationError(e + "." + i, t[i], 'constants must start with "@"'));
                return n };
        }, { "../error/validation_error": 164, "../util/get_type": 166 }],
        173: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                unbundle = require("../util/unbundle_jsonlint");
            module.exports = function(e) {
                var r = e.key,
                    n = e.value,
                    u = e.valueSpec,
                    o = [];
                return Array.isArray(u.values) ? u.values.indexOf(unbundle(n)) === -1 && o.push(new ValidationError(r, n, "expected one of [%s], %s found", u.values.join(", "), n)) : Object.keys(u.values).indexOf(unbundle(n)) === -1 && o.push(new ValidationError(r, n, "expected one of [%s], %s found", Object.keys(u.values).join(", "), n)), o };
        }, { "../error/validation_error": 164, "../util/unbundle_jsonlint": 167 }],
        174: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                validateEnum = require("./validate_enum"),
                getType = require("../util/get_type"),
                unbundle = require("../util/unbundle_jsonlint");
            module.exports = function e(t) {
                var r, a = t.value,
                    n = t.key,
                    l = t.styleSpec,
                    s = [];
                if ("array" !== getType(a)) return [new ValidationError(n, a, "array expected, %s found", getType(a))];
                if (a.length < 1) return [new ValidationError(n, a, "filter array must have at least 1 element")];
                switch (s = s.concat(validateEnum({ key: n + "[0]", value: a[0], valueSpec: l.filter_operator, style: t.style, styleSpec: t.styleSpec })), unbundle(a[0])) {
                    case "<":
                    case "<=":
                    case ">":
                    case ">=":
                        a.length >= 2 && "$type" == a[1] && s.push(new ValidationError(n, a, '"$type" cannot be use with operator "%s"', a[0]));
                    case "==":
                    case "!=":
                        3 != a.length && s.push(new ValidationError(n, a, 'filter array for operator "%s" must have 3 elements', a[0]));
                    case "in":
                    case "!in":
                        a.length >= 2 && (r = getType(a[1]), "string" !== r ? s.push(new ValidationError(n + "[1]", a[1], "string expected, %s found", r)) : "@" === a[1][0] && s.push(new ValidationError(n + "[1]", a[1], "filter key cannot be a constant")));
                        for (var o = 2; o < a.length; o++) r = getType(a[o]), "$type" == a[1] ? s = s.concat(validateEnum({ key: n + "[" + o + "]", value: a[o], valueSpec: l.geometry_type, style: t.style, styleSpec: t.styleSpec })) : "string" === r && "@" === a[o][0] ? s.push(new ValidationError(n + "[" + o + "]", a[o], "filter value cannot be a constant")) : "string" !== r && "number" !== r && "boolean" !== r && s.push(new ValidationError(n + "[" + o + "]", a[o], "string, number, or boolean expected, %s found", r));
                        break;
                    case "any":
                    case "all":
                    case "none":
                        for (o = 1; o < a.length; o++) s = s.concat(e({ key: n + "[" + o + "]", value: a[o], style: t.style, styleSpec: t.styleSpec }));
                        break;
                    case "has":
                    case "!has":
                        r = getType(a[1]), 2 !== a.length ? s.push(new ValidationError(n, a, 'filter array for "%s" operator must have 2 elements', a[0])) : "string" !== r ? s.push(new ValidationError(n + "[1]", a[1], "string expected, %s found", r)) : "@" === a[1][0] && s.push(new ValidationError(n + "[1]", a[1], "filter key cannot be a constant")) }
                return s };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "../util/unbundle_jsonlint": 167, "./validate_enum": 173 }],
        175: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type"),
                validate = require("./validate"),
                validateObject = require("./validate_object"),
                validateArray = require("./validate_array"),
                validateNumber = require("./validate_number"),
                unbundle = require("../util/unbundle_jsonlint");
            module.exports = function(e) {
                function t(e) {
                    if ("identity" === unbundle(l.type)) return [new ValidationError(e.key, e.value, 'identity function may not have a "stops" property')];
                    var t = [],
                        a = e.value;
                    return t = t.concat(validateArray({ key: e.key, value: a, valueSpec: e.valueSpec, style: e.style, styleSpec: e.styleSpec, arrayElementValidator: r })), "array" === getType(a) && 0 === a.length && t.push(new ValidationError(e.key, a, "array must have at least one stop")), t }

                function r(e) {
                    var t = [],
                        r = e.value,
                        l = e.key;
                    if ("array" !== getType(r)) return [new ValidationError(l, r, "array expected, %s found", getType(r))];
                    if (2 !== r.length) return [new ValidationError(l, r, "array length %d expected, length %d found", 2, r.length)];
                    var i = getType(r[0]);
                    if (n || (n = i), i !== n) return [new ValidationError(l, r, "%s stop key type must match previous stop key type %s", i, n)];
                    if ("object" === i) {
                        if (void 0 === r[0].zoom) return [new ValidationError(l, r, "object stop key must have zoom")];
                        if (void 0 === r[0].value) return [new ValidationError(l, r, "object stop key must have value")];
                        t = t.concat(validateObject({ key: l + "[0]", value: r[0], valueSpec: { zoom: {} }, style: e.style, styleSpec: e.styleSpec, objectElementValidators: { zoom: validateNumber, value: a } })) } else t = t.concat((u ? validateNumber : a)({ key: l + "[0]", value: r[0], valueSpec: {}, style: e.style, styleSpec: e.styleSpec }));
                    return t = t.concat(validate({ key: l + "[1]", value: r[1], valueSpec: o, style: e.style, styleSpec: e.styleSpec })), "number" === getType(r[0]) && ("piecewise-constant" === o.function && r[0] % 1 !== 0 && t.push(new ValidationError(l + "[0]", r[0], "zoom level for piecewise-constant functions must be an integer")), 0 !== e.arrayIndex && r[0] < e.array[e.arrayIndex - 1][0] && t.push(new ValidationError(l + "[0]", r[0], "array stops must appear in ascending order"))), t }

                function a(e) {
                    var t = [],
                        r = getType(e.value);
                    return "number" !== r && "string" !== r && "array" !== r && t.push(new ValidationError(e.key, e.value, "property value must be a number, string or array")), t }
                var n, o = e.valueSpec,
                    l = e.value,
                    i = void 0 !== e.value.property || "object" === n,
                    u = void 0 === e.value.property || "object" === n,
                    s = validateObject({ key: e.key, value: e.value, valueSpec: e.styleSpec.function, style: e.style, styleSpec: e.styleSpec, objectElementValidators: { stops: t } });
                return "identity" === unbundle(e.value.type) || e.value.stops || s.push(new ValidationError(e.key, e.value, 'missing required property "stops"')), e.styleSpec.$version >= 8 && (i && !e.valueSpec["property-function"] ? s.push(new ValidationError(e.key, e.value, "property functions not supported")) : u && !e.valueSpec["zoom-function"] && s.push(new ValidationError(e.key, e.value, "zoom functions not supported"))), s };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "../util/unbundle_jsonlint": 167, "./validate": 168, "./validate_array": 169, "./validate_number": 180, "./validate_object": 181 }],
        176: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                validateString = require("./validate_string");
            module.exports = function(r) {
                var e = r.value,
                    t = r.key,
                    a = validateString(r);
                return a.length ? a : (e.indexOf("{fontstack}") === -1 && a.push(new ValidationError(t, e, '"glyphs" url must include a "{fontstack}" token')), e.indexOf("{range}") === -1 && a.push(new ValidationError(t, e, '"glyphs" url must include a "{range}" token')), a) };
        }, { "../error/validation_error": 164, "./validate_string": 184 }],
        177: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                unbundle = require("../util/unbundle_jsonlint"),
                validateObject = require("./validate_object"),
                validateFilter = require("./validate_filter"),
                validatePaintProperty = require("./validate_paint_property"),
                validateLayoutProperty = require("./validate_layout_property"),
                extend = require("../util/extend");
            module.exports = function(e) {
                var r = [],
                    t = e.value,
                    a = e.key,
                    i = e.style,
                    l = e.styleSpec;
                t.type || t.ref || r.push(new ValidationError(a, t, 'either "type" or "ref" is required'));
                var o = unbundle(t.type),
                    u = unbundle(t.ref);
                if (t.id)
                    for (var n = 0; n < e.arrayIndex; n++) {
                        var s = i.layers[n];
                        unbundle(s.id) === unbundle(t.id) && r.push(new ValidationError(a, t.id, 'duplicate layer id "%s", previously used at line %d', t.id, s.id.__line__)) }
                if ("ref" in t) {
                    ["type", "source", "source-layer", "filter", "layout"].forEach(function(e) { e in t && r.push(new ValidationError(a, t[e], '"%s" is prohibited for ref layers', e)) });
                    var d;
                    i.layers.forEach(function(e) { e.id == u && (d = e) }), d ? d.ref ? r.push(new ValidationError(a, t.ref, "ref cannot reference another ref layer")) : o = unbundle(d.type) : r.push(new ValidationError(a, t.ref, 'ref layer "%s" not found', u)) } else if ("background" !== o)
                    if (t.source) {
                        var y = i.sources && i.sources[t.source];
                        y ? "vector" == y.type && "raster" == o ? r.push(new ValidationError(a, t.source, 'layer "%s" requires a raster source', t.id)) : "raster" == y.type && "raster" != o ? r.push(new ValidationError(a, t.source, 'layer "%s" requires a vector source', t.id)) : "vector" != y.type || t["source-layer"] || r.push(new ValidationError(a, t, 'layer "%s" must specify a "source-layer"', t.id)) : r.push(new ValidationError(a, t.source, 'source "%s" not found', t.source)) } else r.push(new ValidationError(a, t, 'missing required property "source"'));
                return r = r.concat(validateObject({ key: a, value: t, valueSpec: l.layer, style: e.style, styleSpec: e.styleSpec, objectElementValidators: { filter: validateFilter, layout: function(e) {
                            return validateObject({ layer: t, key: e.key, value: e.value, style: e.style, styleSpec: e.styleSpec, objectElementValidators: { "*": function(e) {
                                        return validateLayoutProperty(extend({ layerType: o }, e)) } } }) }, paint: function(e) {
                            return validateObject({ layer: t, key: e.key, value: e.value, style: e.style, styleSpec: e.styleSpec, objectElementValidators: { "*": function(e) {
                                        return validatePaintProperty(extend({ layerType: o }, e)) } } }) } } })) };
        }, { "../error/validation_error": 164, "../util/extend": 165, "../util/unbundle_jsonlint": 167, "./validate_filter": 174, "./validate_layout_property": 178, "./validate_object": 181, "./validate_paint_property": 182 }],
        178: [function(require, module, exports) {
            "use strict";
            var validate = require("./validate"),
                ValidationError = require("../error/validation_error");
            module.exports = function(e) {
                var r = e.key,
                    t = e.style,
                    a = e.styleSpec,
                    i = e.value,
                    l = e.objectKey,
                    o = a["layout_" + e.layerType];
                if (!o) return [];
                if (e.valueSpec || o[l]) {
                    var s = [];
                    return "symbol" === e.layerType && ("icon-image" === l && t && !t.sprite ? s.push(new ValidationError(r, i, 'use of "icon-image" requires a style "sprite" property')) : "text-field" === l && t && !t.glyphs && s.push(new ValidationError(r, i, 'use of "text-field" requires a style "glyphs" property'))), s.concat(validate({ key: e.key, value: i, valueSpec: e.valueSpec || o[l], style: t, styleSpec: a })) }
                return [new ValidationError(r, i, 'unknown property "%s"', l)] };
        }, { "../error/validation_error": 164, "./validate": 168 }],
        179: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type"),
                validate = require("./validate"),
                validateTypes = { enum: require("./validate_enum"), color: require("./validate_color"), array: require("./validate_array"), number: require("./validate_number"), function: require("./validate_function") };
            module.exports = function(e) {
                var r, t = e.value,
                    a = e.styleSpec,
                    i = a.$root.light,
                    n = e.style,
                    l = [];
                for (var o in t) {
                    var u = o.match(/^(.*)-transition$/);
                    if (u && i[u[1]] && i[u[1]].transition) {
                        var c = u[1];
                        r = i[c].type, l = l.concat(validate({ key: o, value: t[o], valueSpec: a.transition, style: n, styleSpec: a })) } else i[o] ? (r = i[o].type, i[o].function && "object" === getType(t[o]) && (r = "function"), l = l.concat(validateTypes[r]({ key: o, value: t[o], valueSpec: i[o], style: n, styleSpec: a }))) : l = l.concat([new ValidationError(o, t[o], 'unknown property "%s"', o)]) }
                return l };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "./validate": 168, "./validate_array": 169, "./validate_color": 171, "./validate_enum": 173, "./validate_function": 175, "./validate_number": 180 }],
        180: [function(require, module, exports) {
            "use strict";
            var getType = require("../util/get_type"),
                ValidationError = require("../error/validation_error");
            module.exports = function(e) {
                var r = e.key,
                    i = e.value,
                    m = e.valueSpec,
                    a = getType(i);
                return "number" !== a ? [new ValidationError(r, i, "number expected, %s found", a)] : "minimum" in m && i < m.minimum ? [new ValidationError(r, i, "%s is less than the minimum value %s", i, m.minimum)] : "maximum" in m && i > m.maximum ? [new ValidationError(r, i, "%s is greater than the maximum value %s", i, m.maximum)] : [] };
        }, { "../error/validation_error": 164, "../util/get_type": 166 }],
        181: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                getType = require("../util/get_type"),
                validate = require("./validate");
            module.exports = function(e) {
                var r = e.key,
                    t = e.value,
                    i = e.valueSpec,
                    o = e.objectElementValidators || {},
                    a = e.style,
                    l = e.styleSpec,
                    n = [],
                    u = getType(t);
                if ("object" !== u) return [new ValidationError(r, t, "object expected, %s found", u)];
                for (var d in t) {
                    var p = d.split(".")[0],
                        s = i && (i[p] || i["*"]),
                        c = o[p] || o["*"];
                    s || c ? n = n.concat((c || validate)({ key: (r ? r + "." : r) + d, value: t[d], valueSpec: s, style: a, styleSpec: l, object: t, objectKey: d })) : "" !== r && 1 !== r.split(".").length && n.push(new ValidationError(r, t[d], 'unknown property "%s"', d)) }
                for (p in i) i[p].required && void 0 === i[p].default && void 0 === t[p] && n.push(new ValidationError(r, t, 'missing required property "%s"', p));
                return n };
        }, { "../error/validation_error": 164, "../util/get_type": 166, "./validate": 168 }],
        182: [function(require, module, exports) {
            "use strict";
            var validate = require("./validate"),
                ValidationError = require("../error/validation_error");
            module.exports = function(e) {
                var r = e.key,
                    a = e.style,
                    t = e.styleSpec,
                    i = e.value,
                    l = e.objectKey,
                    n = t["paint_" + e.layerType];
                if (!n) return [];
                var o = l.match(/^(.*)-transition$/);
                return o && n[o[1]] && n[o[1]].transition ? validate({ key: r, value: i, valueSpec: t.transition, style: a, styleSpec: t }) : e.valueSpec || n[l] ? validate({ key: e.key, value: i, valueSpec: e.valueSpec || n[l], style: a, styleSpec: t }) : [new ValidationError(r, i, 'unknown property "%s"', l)] };
        }, { "../error/validation_error": 164, "./validate": 168 }],
        183: [function(require, module, exports) {
            "use strict";
            var ValidationError = require("../error/validation_error"),
                unbundle = require("../util/unbundle_jsonlint"),
                validateObject = require("./validate_object"),
                validateEnum = require("./validate_enum");
            module.exports = function(e) {
                var r = e.value,
                    t = e.key,
                    a = e.styleSpec,
                    l = e.style;
                if (!r.type) return [new ValidationError(t, r, '"type" is required')];
                var u = unbundle(r.type);
                switch (u) {
                    case "vector":
                    case "raster":
                        var i = [];
                        if (i = i.concat(validateObject({ key: t, value: r, valueSpec: a.source_tile, style: e.style, styleSpec: a })), "url" in r)
                            for (var s in r)["type", "url", "tileSize"].indexOf(s) < 0 && i.push(new ValidationError(t + "." + s, r[s], 'a source with a "url" property may not include a "%s" property', s));
                        return i;
                    case "geojson":
                        return validateObject({ key: t, value: r, valueSpec: a.source_geojson, style: l, styleSpec: a });
                    case "video":
                        return validateObject({ key: t, value: r, valueSpec: a.source_video, style: l, styleSpec: a });
                    case "image":
                        return validateObject({ key: t, value: r, valueSpec: a.source_image, style: l, styleSpec: a });
                    default:
                        return validateEnum({ key: t + ".type", value: r.type, valueSpec: { values: ["vector", "raster", "geojson", "video", "image"] }, style: l, styleSpec: a }) } };
        }, { "../error/validation_error": 164, "../util/unbundle_jsonlint": 167, "./validate_enum": 173, "./validate_object": 181 }],
        184: [function(require, module, exports) {
            "use strict";
            var getType = require("../util/get_type"),
                ValidationError = require("../error/validation_error");
            module.exports = function(r) {
                var e = r.value,
                    t = r.key,
                    i = getType(e);
                return "string" !== i ? [new ValidationError(t, e, "string expected, %s found", i)] : [] };
        }, { "../error/validation_error": 164, "../util/get_type": 166 }],
        185: [function(require, module, exports) {
            "use strict";

            function validateStyleMin(e, a) { a = a || latestStyleSpec;
                var t = [];
                return t = t.concat(validate({ key: "", value: e, valueSpec: a.$root, styleSpec: a, style: e, objectElementValidators: { glyphs: validateGlyphsURL } })), a.$version > 7 && e.constants && (t = t.concat(validateConstants({ key: "constants", value: e.constants, style: e, styleSpec: a }))), sortErrors(t) }

            function sortErrors(e) {
                return [].concat(e).sort(function(e, a) {
                    return e.line - a.line }) }

            function wrapCleanErrors(e) {
                return function() {
                    return sortErrors(e.apply(this, arguments)) } }
            var validateConstants = require("./validate/validate_constants"),
                validate = require("./validate/validate"),
                latestStyleSpec = require("../reference/latest.min"),
                validateGlyphsURL = require("./validate/validate_glyphs_url");
            validateStyleMin.source = wrapCleanErrors(require("./validate/validate_source")), validateStyleMin.light = wrapCleanErrors(require("./validate/validate_light")), validateStyleMin.layer = wrapCleanErrors(require("./validate/validate_layer")), validateStyleMin.filter = wrapCleanErrors(require("./validate/validate_filter")), validateStyleMin.paintProperty = wrapCleanErrors(require("./validate/validate_paint_property")), validateStyleMin.layoutProperty = wrapCleanErrors(require("./validate/validate_layout_property")), module.exports = validateStyleMin;
        }, { "../reference/latest.min": 186, "./validate/validate": 168, "./validate/validate_constants": 172, "./validate/validate_filter": 174, "./validate/validate_glyphs_url": 176, "./validate/validate_layer": 177, "./validate/validate_layout_property": 178, "./validate/validate_light": 179, "./validate/validate_paint_property": 182, "./validate/validate_source": 183 }],
        186: [function(require, module, exports) {
            module.exports = require("./v8.min.json");
        }, { "./v8.min.json": 187 }],
        187: [function(require, module, exports) {
            module.exports = { "$version": 8, "$root": { "version": { "required": true, "type": "enum", "values": [8] }, "name": { "type": "string" }, "metadata": { "type": "*" }, "center": { "type": "array", "value": "number" }, "zoom": { "type": "number" }, "bearing": { "type": "number", "default": 0, "period": 360, "units": "degrees" }, "pitch": { "type": "number", "default": 0, "units": "degrees" }, "light": { "anchor": { "type": "enum", "default": "viewport", "values": { "map": {}, "viewport": {} }, "transition": false }, "position": { "type": "array", "default": [1.15, 210, 30], "length": 3, "value": "number", "transition": true, "function": "interpolated", "zoom-function": true, "property-function": false }, "color": { "type": "color", "default": "#ffffff", "function": "interpolated", "zoom-function": true, "property-function": false, "transition": true }, "intensity": { "type": "number", "default": 0.5, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "property-function": false, "transition": true } }, "sources": { "required": true, "type": "sources" }, "sprite": { "type": "string" }, "glyphs": { "type": "string" }, "transition": { "type": "transition" }, "layers": { "required": true, "type": "array", "value": "layer" } }, "sources": { "*": { "type": "source" } }, "source": ["source_tile", "source_geojson", "source_video", "source_image"], "source_tile": { "type": { "required": true, "type": "enum", "values": { "vector": {}, "raster": {} } }, "url": { "type": "string" }, "tiles": { "type": "array", "value": "string" }, "minzoom": { "type": "number", "default": 0 }, "maxzoom": { "type": "number", "default": 22 }, "tileSize": { "type": "number", "default": 512, "units": "pixels" }, "*": { "type": "*" } }, "source_geojson": { "type": { "required": true, "type": "enum", "values": { "geojson": {} } }, "data": { "type": "*" }, "maxzoom": { "type": "number", "default": 18 }, "buffer": { "type": "number", "default": 128, "maximum": 512, "minimum": 0 }, "tolerance": { "type": "number", "default": 0.375 }, "cluster": { "type": "boolean", "default": false }, "clusterRadius": { "type": "number", "default": 50, "minimum": 0 }, "clusterMaxZoom": { "type": "number" } }, "source_video": { "type": { "required": true, "type": "enum", "values": { "video": {} } }, "urls": { "required": true, "type": "array", "value": "string" }, "coordinates": { "required": true, "type": "array", "length": 4, "value": { "type": "array", "length": 2, "value": "number" } } }, "source_image": { "type": { "required": true, "type": "enum", "values": { "image": {} } }, "url": { "required": true, "type": "string" }, "coordinates": { "required": true, "type": "array", "length": 4, "value": { "type": "array", "length": 2, "value": "number" } } }, "layer": { "id": { "type": "string", "required": true }, "type": { "type": "enum", "values": { "fill": {}, "line": {}, "symbol": {}, "circle": {}, "raster": {}, "background": {} } }, "metadata": { "type": "*" }, "ref": { "type": "string" }, "source": { "type": "string" }, "source-layer": { "type": "string" }, "minzoom": { "type": "number", "minimum": 0, "maximum": 22 }, "maxzoom": { "type": "number", "minimum": 0, "maximum": 22 }, "interactive": { "type": "boolean", "default": false }, "filter": { "type": "filter" }, "layout": { "type": "layout" }, "paint": { "type": "paint" }, "paint.*": { "type": "paint" } }, "layout": ["layout_fill", "layout_line", "layout_circle", "layout_symbol", "layout_raster", "layout_background"], "layout_background": { "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "layout_fill": { "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "layout_circle": { "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "layout_line": { "line-cap": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "butt": {}, "round": {}, "square": {} }, "default": "butt" }, "line-join": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "bevel": {}, "round": {}, "miter": {} }, "default": "miter" }, "line-miter-limit": { "type": "number", "default": 2, "function": "interpolated", "zoom-function": true, "property-function": true, "requires": [{ "line-join": "miter" }] }, "line-round-limit": { "type": "number", "default": 1.05, "function": "interpolated", "zoom-function": true, "property-function": true, "requires": [{ "line-join": "round" }] }, "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "layout_symbol": { "symbol-placement": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "point": {}, "line": {} }, "default": "point" }, "symbol-spacing": { "type": "number", "default": 250, "minimum": 1, "function": "interpolated", "zoom-function": true, "property-function": true, "units": "pixels", "requires": [{ "symbol-placement": "line" }] }, "symbol-avoid-edges": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false }, "icon-allow-overlap": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["icon-image"] }, "icon-ignore-placement": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["icon-image"] }, "icon-optional": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["icon-image", "text-field"] }, "icon-rotation-alignment": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {}, "auto": {} }, "default": "auto", "requires": ["icon-image"] }, "icon-size": { "type": "number", "default": 1, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["icon-image"] }, "icon-text-fit": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": false, "values": { "none": {}, "width": {}, "height": {}, "both": {} }, "default": "none", "requires": ["icon-image", "text-field"] }, "icon-text-fit-padding": { "type": "array", "value": "number", "length": 4, "default": [0, 0, 0, 0], "units": "pixels", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["icon-image", "text-field", { "icon-text-fit": ["both", "width", "height"] }] }, "icon-image": { "type": "string", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "tokens": true }, "icon-rotate": { "type": "number", "default": 0, "period": 360, "function": "interpolated", "zoom-function": true, "property-function": true, "units": "degrees", "requires": ["icon-image"] }, "icon-padding": { "type": "number", "default": 2, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "units": "pixels", "requires": ["icon-image"] }, "icon-keep-upright": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["icon-image", { "icon-rotation-alignment": "map" }, { "symbol-placement": "line" }] }, "icon-offset": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["icon-image"] }, "text-pitch-alignment": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {}, "auto": {} }, "default": "auto", "requires": ["text-field"] }, "text-rotation-alignment": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {}, "auto": {} }, "default": "auto", "requires": ["text-field"] }, "text-field": { "type": "string", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": "", "tokens": true }, "text-font": { "type": "array", "value": "string", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": ["Open Sans Regular", "Arial Unicode MS Regular"], "requires": ["text-field"] }, "text-size": { "type": "number", "default": 16, "minimum": 0, "units": "pixels", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-max-width": { "type": "number", "default": 10, "minimum": 0, "units": "ems", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-line-height": { "type": "number", "default": 1.2, "units": "ems", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-letter-spacing": { "type": "number", "default": 0, "units": "ems", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-justify": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "left": {}, "center": {}, "right": {} }, "default": "center", "requires": ["text-field"] }, "text-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "center": {}, "left": {}, "right": {}, "top": {}, "bottom": {}, "top-left": {}, "top-right": {}, "bottom-left": {}, "bottom-right": {} }, "default": "center", "requires": ["text-field"] }, "text-max-angle": { "type": "number", "default": 45, "units": "degrees", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field", { "symbol-placement": "line" }] }, "text-rotate": { "type": "number", "default": 0, "period": 360, "units": "degrees", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-padding": { "type": "number", "default": 2, "minimum": 0, "units": "pixels", "function": "interpolated", "zoom-function": true, "property-function": true, "requires": ["text-field"] }, "text-keep-upright": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": true, "requires": ["text-field", { "text-rotation-alignment": "map" }, { "symbol-placement": "line" }] }, "text-transform": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "none": {}, "uppercase": {}, "lowercase": {} }, "default": "none", "requires": ["text-field"] }, "text-offset": { "type": "array", "value": "number", "units": "ems", "function": "interpolated", "zoom-function": true, "property-function": true, "length": 2, "default": [0, 0], "requires": ["text-field"] }, "text-allow-overlap": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["text-field"] }, "text-ignore-placement": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["text-field"] }, "text-optional": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": false, "requires": ["text-field", "icon-image"] }, "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "layout_raster": { "visibility": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "values": { "visible": {}, "none": {} }, "default": "visible" } }, "filter": { "type": "array", "value": "*" }, "filter_operator": { "type": "enum", "values": { "==": {}, "!=": {}, ">": {}, ">=": {}, "<": {}, "<=": {}, "in": {}, "!in": {}, "all": {}, "any": {}, "none": {}, "has": {}, "!has": {} } }, "geometry_type": { "type": "enum", "values": { "Point": {}, "LineString": {}, "Polygon": {} } }, "function": { "stops": { "type": "array", "value": "function_stop" }, "base": { "type": "number", "default": 1, "minimum": 0 }, "property": { "type": "string", "default": "$zoom" }, "type": { "type": "enum", "values": { "identity": {}, "exponential": {}, "interval": {}, "categorical": {} }, "default": "exponential" }, "colorSpace": { "type": "enum", "values": { "rgb": {}, "lab": {}, "hcl": {} }, "default": "rgb" } }, "function_stop": { "type": "array", "minimum": 0, "maximum": 22, "value": ["number", "color"], "length": 2 }, "paint": ["paint_fill", "paint_line", "paint_circle", "paint_symbol", "paint_raster", "paint_background"], "paint_fill": { "fill-antialias": { "type": "boolean", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "default": true }, "fill-opacity": { "type": "number", "function": "interpolated", "zoom-function": true, "property-function": true, "default": 1, "minimum": 0, "maximum": 1, "transition": true }, "fill-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": [{ "!": "fill-pattern" }] }, "fill-outline-color": { "type": "color", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": [{ "!": "fill-pattern" }, { "fill-antialias": true }] }, "fill-translate": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "fill-translate-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map", "requires": ["fill-translate"] }, "fill-pattern": { "type": "string", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "transition": true }, "fill-extrude-height": { "type": "number", "function": "interpolated", "zoom-function": true, "property-function": true, "default": 0, "minimum": 0, "transition": true }, "fill-extrude-base": { "type": "number", "function": "interpolated", "zoom-function": true, "property-function": true, "default": 0, "minimum": 0, "transition": true, "requires": [{ "<=": "fill-extrude-height" }] } }, "paint_line": { "line-opacity": { "type": "number", "function": "interpolated", "zoom-function": true, "property-function": true, "default": 1, "minimum": 0, "maximum": 1, "transition": true }, "line-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": [{ "!": "line-pattern" }] }, "line-translate": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "line-translate-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map", "requires": ["line-translate"] }, "line-width": { "type": "number", "default": 1, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "line-gap-width": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "line-offset": { "type": "number", "default": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "line-blur": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "line-dasharray": { "type": "array", "value": "number", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "minimum": 0, "transition": true, "units": "line widths", "requires": [{ "!": "line-pattern" }] }, "line-pattern": { "type": "string", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "transition": true } }, "paint_circle": { "circle-radius": { "type": "number", "default": 5, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "circle-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true }, "circle-blur": { "type": "number", "default": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true }, "circle-opacity": { "type": "number", "default": 1, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true }, "circle-translate": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels" }, "circle-translate-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map", "requires": ["circle-translate"] }, "circle-pitch-scale": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map" } }, "paint_symbol": { "icon-opacity": { "type": "number", "default": 1, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["icon-image"] }, "icon-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["icon-image"] }, "icon-halo-color": { "type": "color", "default": "rgba(0, 0, 0, 0)", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["icon-image"] }, "icon-halo-width": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["icon-image"] }, "icon-halo-blur": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["icon-image"] }, "icon-translate": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["icon-image"] }, "icon-translate-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map", "requires": ["icon-image", "icon-translate"] }, "text-opacity": { "type": "number", "default": 1, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["text-field"] }, "text-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["text-field"] }, "text-halo-color": { "type": "color", "default": "rgba(0, 0, 0, 0)", "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "requires": ["text-field"] }, "text-halo-width": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["text-field"] }, "text-halo-blur": { "type": "number", "default": 0, "minimum": 0, "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["text-field"] }, "text-translate": { "type": "array", "value": "number", "length": 2, "default": [0, 0], "function": "interpolated", "zoom-function": true, "property-function": true, "transition": true, "units": "pixels", "requires": ["text-field"] }, "text-translate-anchor": { "type": "enum", "function": "piecewise-constant", "zoom-function": true, "property-function": true, "values": { "map": {}, "viewport": {} }, "default": "map", "requires": ["text-field", "text-translate"] } }, "paint_raster": { "raster-opacity": { "type": "number", "default": 1, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "transition": true }, "raster-hue-rotate": { "type": "number", "default": 0, "period": 360, "function": "interpolated", "zoom-function": true, "transition": true, "units": "degrees" }, "raster-brightness-min": { "type": "number", "function": "interpolated", "zoom-function": true, "default": 0, "minimum": 0, "maximum": 1, "transition": true }, "raster-brightness-max": { "type": "number", "function": "interpolated", "zoom-function": true, "default": 1, "minimum": 0, "maximum": 1, "transition": true }, "raster-saturation": { "type": "number", "default": 0, "minimum": -1, "maximum": 1, "function": "interpolated", "zoom-function": true, "transition": true }, "raster-contrast": { "type": "number", "default": 0, "minimum": -1, "maximum": 1, "function": "interpolated", "zoom-function": true, "transition": true }, "raster-fade-duration": { "type": "number", "default": 300, "minimum": 0, "function": "interpolated", "zoom-function": true, "transition": true, "units": "milliseconds" } }, "paint_background": { "background-color": { "type": "color", "default": "#000000", "function": "interpolated", "zoom-function": true, "transition": true, "requires": [{ "!": "background-pattern" }] }, "background-pattern": { "type": "string", "function": "piecewise-constant", "zoom-function": true, "transition": true }, "background-opacity": { "type": "number", "default": 1, "minimum": 0, "maximum": 1, "function": "interpolated", "zoom-function": true, "transition": true } }, "transition": { "duration": { "type": "number", "default": 300, "minimum": 0, "units": "milliseconds" }, "delay": { "type": "number", "default": 0, "minimum": 0, "units": "milliseconds" } } }
        }, {}],
        188: [function(require, module, exports) {
            "use strict";

            function isSupported(e) {
                return !!(isBrowser() && isArraySupported() && isFunctionSupported() && isObjectSupported() && isJSONSupported() && isWorkerSupported() && isUint8ClampedArraySupported() && isWebGLSupportedCached(e && e.failIfMajorPerformanceCaveat)) }

            function isBrowser() {
                return "undefined" != typeof window && "undefined" != typeof document }

            function isArraySupported() {
                return Array.prototype && Array.prototype.every && Array.prototype.filter && Array.prototype.forEach && Array.prototype.indexOf && Array.prototype.lastIndexOf && Array.prototype.map && Array.prototype.some && Array.prototype.reduce && Array.prototype.reduceRight && Array.isArray }

            function isFunctionSupported() {
                return Function.prototype && Function.prototype.bind }

            function isObjectSupported() {
                return Object.keys && Object.create && Object.getPrototypeOf && Object.getOwnPropertyNames && Object.isSealed && Object.isFrozen && Object.isExtensible && Object.getOwnPropertyDescriptor && Object.defineProperty && Object.defineProperties && Object.seal && Object.freeze && Object.preventExtensions }

            function isJSONSupported() {
                return "JSON" in window && "parse" in JSON && "stringify" in JSON }

            function isWorkerSupported() {
                return "Worker" in window }

            function isUint8ClampedArraySupported() {
                return "Uint8ClampedArray" in window }

            function isWebGLSupportedCached(e) {
                return void 0 === isWebGLSupportedCache[e] && (isWebGLSupportedCache[e] = isWebGLSupported(e)), isWebGLSupportedCache[e] }

            function isWebGLSupported(e) {
                var t = document.createElement("canvas"),
                    r = Object.create(isSupported.webGLContextAttributes);
                return r.failIfMajorPerformanceCaveat = e, t.probablySupportsContext ? t.probablySupportsContext("webgl", r) || t.probablySupportsContext("experimental-webgl", r) : t.supportsContext ? t.supportsContext("webgl", r) || t.supportsContext("experimental-webgl", r) : t.getContext("webgl", r) || t.getContext("experimental-webgl", r) }
            "undefined" != typeof module && module.exports ? module.exports = isSupported : window && (window.mapboxgl = window.mapboxgl || {}, window.mapboxgl.supported = isSupported);
            var isWebGLSupportedCache = {};
            isSupported.webGLContextAttributes = { antialias: !1, alpha: !0, stencil: !0, depth: !0 };
        }, {}],
        189: [function(require, module, exports) {
            "use strict";

            function Buffer(t) {
                var e;
                t && t.length && (e = t, t = e.length);
                var r = new Uint8Array(t || 0);
                return e && r.set(e), r.readUInt32LE = BufferMethods.readUInt32LE, r.writeUInt32LE = BufferMethods.writeUInt32LE, r.readInt32LE = BufferMethods.readInt32LE, r.writeInt32LE = BufferMethods.writeInt32LE, r.readFloatLE = BufferMethods.readFloatLE, r.writeFloatLE = BufferMethods.writeFloatLE, r.readDoubleLE = BufferMethods.readDoubleLE, r.writeDoubleLE = BufferMethods.writeDoubleLE, r.toString = BufferMethods.toString, r.write = BufferMethods.write, r.slice = BufferMethods.slice, r.copy = BufferMethods.copy, r._isBuffer = !0, r }

            function encodeString(t) {
                for (var e, r, n = t.length, i = [], o = 0; o < n; o++) {
                    if (e = t.charCodeAt(o), e > 55295 && e < 57344) {
                        if (!r) { e > 56319 || o + 1 === n ? i.push(239, 191, 189) : r = e;
                            continue }
                        if (e < 56320) { i.push(239, 191, 189), r = e;
                            continue }
                        e = r - 55296 << 10 | e - 56320 | 65536, r = null } else r && (i.push(239, 191, 189), r = null);
                    e < 128 ? i.push(e) : e < 2048 ? i.push(e >> 6 | 192, 63 & e | 128) : e < 65536 ? i.push(e >> 12 | 224, e >> 6 & 63 | 128, 63 & e | 128) : i.push(e >> 18 | 240, e >> 12 & 63 | 128, e >> 6 & 63 | 128, 63 & e | 128) }
                return i }
            module.exports = Buffer;
            var ieee754 = require("ieee754"),
                BufferMethods, lastStr, lastStrEncoded;
            BufferMethods = { readUInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3] }, writeUInt32LE: function(t, e) { this[e] = t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24 }, readInt32LE: function(t) {
                    return (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + (this[t + 3] << 24) }, readFloatLE: function(t) {
                    return ieee754.read(this, t, !0, 23, 4) }, readDoubleLE: function(t) {
                    return ieee754.read(this, t, !0, 52, 8) }, writeFloatLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 23, 4) }, writeDoubleLE: function(t, e) {
                    return ieee754.write(this, t, e, !0, 52, 8) }, toString: function(t, e, r) {
                    var n = "",
                        i = "";
                    e = e || 0, r = Math.min(this.length, r || this.length);
                    for (var o = e; o < r; o++) {
                        var u = this[o];
                        u <= 127 ? (n += decodeURIComponent(i) + String.fromCharCode(u), i = "") : i += "%" + u.toString(16) }
                    return n += decodeURIComponent(i) }, write: function(t, e) {
                    for (var r = t === lastStr ? lastStrEncoded : encodeString(t), n = 0; n < r.length; n++) this[e + n] = r[n] }, slice: function(t, e) {
                    return this.subarray(t, e) }, copy: function(t, e) { e = e || 0;
                    for (var r = 0; r < this.length; r++) t[e + r] = this[r] } }, BufferMethods.writeInt32LE = BufferMethods.writeUInt32LE, Buffer.byteLength = function(t) {
                return lastStr = t, lastStrEncoded = encodeString(t), lastStrEncoded.length }, Buffer.isBuffer = function(t) {
                return !(!t || !t._isBuffer) };
        }, { "ieee754": 191 }],
        190: [function(require, module, exports) {
            (function(global) {
                "use strict";

                function Pbf(t) { this.buf = Buffer.isBuffer(t) ? t : new Buffer(t || 0), this.pos = 0, this.length = this.buf.length }

                function readVarintRemainder(t, i) {
                    var e, r = i.buf;
                    if (e = r[i.pos++], t += 268435456 * (127 & e), e < 128) return t;
                    if (e = r[i.pos++], t += 34359738368 * (127 & e), e < 128) return t;
                    if (e = r[i.pos++], t += 4398046511104 * (127 & e), e < 128) return t;
                    if (e = r[i.pos++], t += 562949953421312 * (127 & e), e < 128) return t;
                    if (e = r[i.pos++], t += 72057594037927940 * (127 & e), e < 128) return t;
                    if (e = r[i.pos++], t += 0x8000000000000000 * (127 & e), e < 128) return t;
                    throw new Error("Expected varint not more than 10 bytes") }

                function writeBigVarint(t, i) { i.realloc(10);
                    for (var e = i.pos + 10; t >= 1;) {
                        if (i.pos >= e) throw new Error("Given varint doesn't fit into 10 bytes");
                        var r = 255 & t;
                        i.buf[i.pos++] = r | (t >= 128 ? 128 : 0), t /= 128 } }

                function reallocForRawMessage(t, i, e) {
                    var r = i <= 16383 ? 1 : i <= 2097151 ? 2 : i <= 268435455 ? 3 : Math.ceil(Math.log(i) / (7 * Math.LN2));
                    e.realloc(r);
                    for (var s = e.pos - 1; s >= t; s--) e.buf[s + r] = e.buf[s] }

                function writePackedVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeVarint(t[e]) }

                function writePackedSVarint(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSVarint(t[e]) }

                function writePackedFloat(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFloat(t[e]) }

                function writePackedDouble(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeDouble(t[e]) }

                function writePackedBoolean(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeBoolean(t[e]) }

                function writePackedFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed32(t[e]) }

                function writePackedSFixed32(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed32(t[e]) }

                function writePackedFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeFixed64(t[e]) }

                function writePackedSFixed64(t, i) {
                    for (var e = 0; e < t.length; e++) i.writeSFixed64(t[e]) }
                module.exports = Pbf;
                var Buffer = global.Buffer || require("./buffer");
                Pbf.Varint = 0, Pbf.Fixed64 = 1, Pbf.Bytes = 2, Pbf.Fixed32 = 5;
                var SHIFT_LEFT_32 = 4294967296,
                    SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32,
                    POW_2_63 = Math.pow(2, 63);
                Pbf.prototype = { destroy: function() { this.buf = null }, readFields: function(t, i, e) {
                        for (e = e || this.length; this.pos < e;) {
                            var r = this.readVarint(),
                                s = r >> 3,
                                n = this.pos;
                            t(s, i, this), this.pos === n && this.skip(r) }
                        return i }, readMessage: function(t, i) {
                        return this.readFields(t, i, this.readVarint() + this.pos) }, readFixed32: function() {
                        var t = this.buf.readUInt32LE(this.pos);
                        return this.pos += 4, t }, readSFixed32: function() {
                        var t = this.buf.readInt32LE(this.pos);
                        return this.pos += 4, t }, readFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readUInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t }, readSFixed64: function() {
                        var t = this.buf.readUInt32LE(this.pos) + this.buf.readInt32LE(this.pos + 4) * SHIFT_LEFT_32;
                        return this.pos += 8, t }, readFloat: function() {
                        var t = this.buf.readFloatLE(this.pos);
                        return this.pos += 4, t }, readDouble: function() {
                        var t = this.buf.readDoubleLE(this.pos);
                        return this.pos += 8, t }, readVarint: function() {
                        var t, i, e = this.buf;
                        return i = e[this.pos++], t = 127 & i, i < 128 ? t : (i = e[this.pos++], t |= (127 & i) << 7, i < 128 ? t : (i = e[this.pos++], t |= (127 & i) << 14, i < 128 ? t : (i = e[this.pos++], t |= (127 & i) << 21, i < 128 ? t : readVarintRemainder(t, this)))) }, readVarint64: function() {
                        var t = this.pos,
                            i = this.readVarint();
                        if (i < POW_2_63) return i;
                        for (var e = this.pos - 2; 255 === this.buf[e];) e--;
                        e < t && (e = t), i = 0;
                        for (var r = 0; r < e - t + 1; r++) {
                            var s = 127 & ~this.buf[t + r];
                            i += r < 4 ? s << 7 * r : s * Math.pow(2, 7 * r) }
                        return -i - 1 }, readSVarint: function() {
                        var t = this.readVarint();
                        return t % 2 === 1 ? (t + 1) / -2 : t / 2 }, readBoolean: function() {
                        return Boolean(this.readVarint()) }, readString: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.toString("utf8", this.pos, t);
                        return this.pos = t, i }, readBytes: function() {
                        var t = this.readVarint() + this.pos,
                            i = this.buf.slice(this.pos, t);
                        return this.pos = t, i }, readPackedVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readVarint());
                        return i }, readPackedSVarint: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSVarint());
                        return i }, readPackedBoolean: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readBoolean());
                        return i }, readPackedFloat: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFloat());
                        return i }, readPackedDouble: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readDouble());
                        return i }, readPackedFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed32());
                        return i }, readPackedSFixed32: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed32());
                        return i }, readPackedFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readFixed64());
                        return i }, readPackedSFixed64: function() {
                        for (var t = this.readVarint() + this.pos, i = []; this.pos < t;) i.push(this.readSFixed64());
                        return i }, skip: function(t) {
                        var i = 7 & t;
                        if (i === Pbf.Varint)
                            for (; this.buf[this.pos++] > 127;);
                        else if (i === Pbf.Bytes) this.pos = this.readVarint() + this.pos;
                        else if (i === Pbf.Fixed32) this.pos += 4;
                        else {
                            if (i !== Pbf.Fixed64) throw new Error("Unimplemented type: " + i);
                            this.pos += 8 } }, writeTag: function(t, i) { this.writeVarint(t << 3 | i) }, realloc: function(t) {
                        for (var i = this.length || 16; i < this.pos + t;) i *= 2;
                        if (i !== this.length) {
                            var e = new Buffer(i);
                            this.buf.copy(e), this.buf = e, this.length = i } }, finish: function() {
                        return this.length = this.pos, this.pos = 0, this.buf.slice(0, this.length) }, writeFixed32: function(t) { this.realloc(4), this.buf.writeUInt32LE(t, this.pos), this.pos += 4 }, writeSFixed32: function(t) { this.realloc(4), this.buf.writeInt32LE(t, this.pos), this.pos += 4 }, writeFixed64: function(t) { this.realloc(8), this.buf.writeInt32LE(t & -1, this.pos), this.buf.writeUInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8 }, writeSFixed64: function(t) { this.realloc(8), this.buf.writeInt32LE(t & -1, this.pos), this.buf.writeInt32LE(Math.floor(t * SHIFT_RIGHT_32), this.pos + 4), this.pos += 8 }, writeVarint: function(t) {
                        return t = +t, t > 268435455 ? void writeBigVarint(t, this) : (this.realloc(4), this.buf[this.pos++] = 127 & t | (t > 127 ? 128 : 0), void(t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = 127 & (t >>>= 7) | (t > 127 ? 128 : 0), t <= 127 || (this.buf[this.pos++] = t >>> 7 & 127))))) }, writeSVarint: function(t) { this.writeVarint(t < 0 ? 2 * -t - 1 : 2 * t) }, writeBoolean: function(t) { this.writeVarint(Boolean(t)) }, writeString: function(t) { t = String(t);
                        var i = Buffer.byteLength(t);
                        this.writeVarint(i), this.realloc(i), this.buf.write(t, this.pos), this.pos += i }, writeFloat: function(t) { this.realloc(4), this.buf.writeFloatLE(t, this.pos), this.pos += 4 }, writeDouble: function(t) { this.realloc(8), this.buf.writeDoubleLE(t, this.pos), this.pos += 8 }, writeBytes: function(t) {
                        var i = t.length;
                        this.writeVarint(i), this.realloc(i);
                        for (var e = 0; e < i; e++) this.buf[this.pos++] = t[e] }, writeRawMessage: function(t, i) { this.pos++;
                        var e = this.pos;
                        t(i, this);
                        var r = this.pos - e;
                        r >= 128 && reallocForRawMessage(e, r, this), this.pos = e - 1, this.writeVarint(r), this.pos += r }, writeMessage: function(t, i, e) { this.writeTag(t, Pbf.Bytes), this.writeRawMessage(i, e) }, writePackedVarint: function(t, i) { this.writeMessage(t, writePackedVarint, i) }, writePackedSVarint: function(t, i) { this.writeMessage(t, writePackedSVarint, i) }, writePackedBoolean: function(t, i) { this.writeMessage(t, writePackedBoolean, i) }, writePackedFloat: function(t, i) { this.writeMessage(t, writePackedFloat, i) }, writePackedDouble: function(t, i) { this.writeMessage(t, writePackedDouble, i) }, writePackedFixed32: function(t, i) { this.writeMessage(t, writePackedFixed32, i) }, writePackedSFixed32: function(t, i) { this.writeMessage(t, writePackedSFixed32, i) }, writePackedFixed64: function(t, i) { this.writeMessage(t, writePackedFixed64, i) }, writePackedSFixed64: function(t, i) { this.writeMessage(t, writePackedSFixed64, i) }, writeBytesField: function(t, i) { this.writeTag(t, Pbf.Bytes), this.writeBytes(i) }, writeFixed32Field: function(t, i) { this.writeTag(t, Pbf.Fixed32), this.writeFixed32(i) }, writeSFixed32Field: function(t, i) { this.writeTag(t, Pbf.Fixed32), this.writeSFixed32(i) }, writeFixed64Field: function(t, i) { this.writeTag(t, Pbf.Fixed64), this.writeFixed64(i) }, writeSFixed64Field: function(t, i) { this.writeTag(t, Pbf.Fixed64), this.writeSFixed64(i) }, writeVarintField: function(t, i) { this.writeTag(t, Pbf.Varint), this.writeVarint(i) }, writeSVarintField: function(t, i) { this.writeTag(t, Pbf.Varint), this.writeSVarint(i) }, writeStringField: function(t, i) { this.writeTag(t, Pbf.Bytes), this.writeString(i) }, writeFloatField: function(t, i) { this.writeTag(t, Pbf.Fixed32), this.writeFloat(i) }, writeDoubleField: function(t, i) { this.writeTag(t, Pbf.Fixed64), this.writeDouble(i) }, writeBooleanField: function(t, i) { this.writeVarintField(t, Boolean(i)) } };
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

        }, { "./buffer": 189 }],
        191: [function(require, module, exports) {
            exports.read = function(a, o, t, r, h) {
                var M, p, w = 8 * h - r - 1,
                    f = (1 << w) - 1,
                    e = f >> 1,
                    i = -7,
                    N = t ? h - 1 : 0,
                    n = t ? -1 : 1,
                    s = a[o + N];
                for (N += n, M = s & (1 << -i) - 1, s >>= -i, i += w; i > 0; M = 256 * M + a[o + N], N += n, i -= 8);
                for (p = M & (1 << -i) - 1, M >>= -i, i += r; i > 0; p = 256 * p + a[o + N], N += n, i -= 8);
                if (0 === M) M = 1 - e;
                else {
                    if (M === f) return p ? NaN : (s ? -1 : 1) * (1 / 0);
                    p += Math.pow(2, r), M -= e }
                return (s ? -1 : 1) * p * Math.pow(2, M - r) }, exports.write = function(a, o, t, r, h, M) {
                var p, w, f, e = 8 * M - h - 1,
                    i = (1 << e) - 1,
                    N = i >> 1,
                    n = 23 === h ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                    s = r ? 0 : M - 1,
                    u = r ? 1 : -1,
                    l = o < 0 || 0 === o && 1 / o < 0 ? 1 : 0;
                for (o = Math.abs(o), isNaN(o) || o === 1 / 0 ? (w = isNaN(o) ? 1 : 0, p = i) : (p = Math.floor(Math.log(o) / Math.LN2), o * (f = Math.pow(2, -p)) < 1 && (p--, f *= 2), o += p + N >= 1 ? n / f : n * Math.pow(2, 1 - N), o * f >= 2 && (p++, f /= 2), p + N >= i ? (w = 0, p = i) : p + N >= 1 ? (w = (o * f - 1) * Math.pow(2, h), p += N) : (w = o * Math.pow(2, N - 1) * Math.pow(2, h), p = 0)); h >= 8; a[t + s] = 255 & w, s += u, w /= 256, h -= 8);
                for (p = p << h | w, e += h; e > 0; a[t + s] = 255 & p, s += u, p /= 256, e -= 8);
                a[t + s - u] |= 128 * l };
        }, {}],
        192: [function(require, module, exports) {
            "use strict";

            function Point(t, n) { this.x = t, this.y = n }
            module.exports = Point, Point.prototype = { clone: function() {
                    return new Point(this.x, this.y) }, add: function(t) {
                    return this.clone()._add(t) }, sub: function(t) {
                    return this.clone()._sub(t) }, mult: function(t) {
                    return this.clone()._mult(t) }, div: function(t) {
                    return this.clone()._div(t) }, rotate: function(t) {
                    return this.clone()._rotate(t) }, matMult: function(t) {
                    return this.clone()._matMult(t) }, unit: function() {
                    return this.clone()._unit() }, perp: function() {
                    return this.clone()._perp() }, round: function() {
                    return this.clone()._round() }, mag: function() {
                    return Math.sqrt(this.x * this.x + this.y * this.y) }, equals: function(t) {
                    return this.x === t.x && this.y === t.y }, dist: function(t) {
                    return Math.sqrt(this.distSqr(t)) }, distSqr: function(t) {
                    var n = t.x - this.x,
                        i = t.y - this.y;
                    return n * n + i * i }, angle: function() {
                    return Math.atan2(this.y, this.x) }, angleTo: function(t) {
                    return Math.atan2(this.y - t.y, this.x - t.x) }, angleWith: function(t) {
                    return this.angleWithSep(t.x, t.y) }, angleWithSep: function(t, n) {
                    return Math.atan2(this.x * n - this.y * t, this.x * t + this.y * n) }, _matMult: function(t) {
                    var n = t[0] * this.x + t[1] * this.y,
                        i = t[2] * this.x + t[3] * this.y;
                    return this.x = n, this.y = i, this }, _add: function(t) {
                    return this.x += t.x, this.y += t.y, this }, _sub: function(t) {
                    return this.x -= t.x, this.y -= t.y, this }, _mult: function(t) {
                    return this.x *= t, this.y *= t, this }, _div: function(t) {
                    return this.x /= t, this.y /= t, this }, _unit: function() {
                    return this._div(this.mag()), this }, _perp: function() {
                    var t = this.y;
                    return this.y = this.x, this.x = -t, this }, _rotate: function(t) {
                    var n = Math.cos(t),
                        i = Math.sin(t),
                        s = n * this.x - i * this.y,
                        r = i * this.x + n * this.y;
                    return this.x = s, this.y = r, this }, _round: function() {
                    return this.x = Math.round(this.x), this.y = Math.round(this.y), this } }, Point.convert = function(t) {
                return t instanceof Point ? t : Array.isArray(t) ? new Point(t[0], t[1]) : t };
        }, {}],
        193: [function(require, module, exports) {
            "use strict";

            function partialSort(a, t, r, o, p) {
                for (r = r || 0, o = o || a.length - 1, p = p || defaultCompare; o > r;) {
                    if (o - r > 600) {
                        var f = o - r + 1,
                            e = t - r + 1,
                            l = Math.log(f),
                            s = .5 * Math.exp(2 * l / 3),
                            i = .5 * Math.sqrt(l * s * (f - s) / f) * (e - f / 2 < 0 ? -1 : 1),
                            n = Math.max(r, Math.floor(t - e * s / f + i)),
                            h = Math.min(o, Math.floor(t + (f - e) * s / f + i));
                        partialSort(a, t, n, h, p) }
                    var u = a[t],
                        M = r,
                        w = o;
                    for (swap(a, r, t), p(a[o], u) > 0 && swap(a, r, o); M < w;) {
                        for (swap(a, M, w), M++, w--; p(a[M], u) < 0;) M++;
                        for (; p(a[w], u) > 0;) w-- }
                    0 === p(a[r], u) ? swap(a, r, w) : (w++, swap(a, w, o)), w <= t && (r = w + 1), t <= w && (o = w - 1) } }

            function swap(a, t, r) {
                var o = a[t];
                a[t] = a[r], a[r] = o }

            function defaultCompare(a, t) {
                return a < t ? -1 : a > t ? 1 : 0 }
            module.exports = partialSort;
        }, {}],
        194: [function(require, module, exports) {
            ! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.ShelfPack = e() }(this, function() {
                function t(t, e, s) { s = s || {}, this.w = t || 64, this.h = e || 64, this.autoResize = !!s.autoResize, this.shelves = [], this.stats = {}, this.count = function(t) { this.stats[t] = (0 | this.stats[t]) + 1 } }

                function e(t, e, s) { this.x = 0, this.y = t, this.w = this.free = e, this.h = s }
                return t.prototype.pack = function(t, e) { t = [].concat(t), e = e || {};
                    for (var s, h, i, n = [], r = 0; r < t.length; r++)
                        if (s = t[r].w || t[r].width, h = t[r].h || t[r].height, s && h) {
                            if (i = this.packOne(s, h), !i) continue;
                            e.inPlace && (t[r].x = i.x, t[r].y = i.y), n.push(i) }
                    if (this.shelves.length > 0) {
                        for (var o = 0, f = 0, u = 0; u < this.shelves.length; u++) {
                            var l = this.shelves[u];
                            f += l.h, o = Math.max(l.w - l.free, o) }
                        this.resize(o, f) }
                    return n }, t.prototype.packOne = function(t, s) {
                    for (var h, i, n = 0, r = { shelf: -1, waste: 1 / 0 }, o = 0; o < this.shelves.length; o++) {
                        if (h = this.shelves[o], n += h.h, s === h.h && t <= h.free) return this.count(s), h.alloc(t, s);
                        s > h.h || t > h.free || s < h.h && t <= h.free && (i = h.h - s, i < r.waste && (r.waste = i, r.shelf = o)) }
                    if (r.shelf !== -1) return h = this.shelves[r.shelf], this.count(s), h.alloc(t, s);
                    if (s <= this.h - n && t <= this.w) return h = new e(n, this.w, s), this.shelves.push(h), this.count(s), h.alloc(t, s);
                    if (this.autoResize) {
                        var f, u, l, a;
                        return f = u = this.h, l = a = this.w, (l <= f || t > l) && (a = 2 * Math.max(t, l)), (f < l || s > f) && (u = 2 * Math.max(s, f)), this.resize(a, u), this.packOne(t, s) }
                    return null }, t.prototype.clear = function() { this.shelves = [], this.stats = {} }, t.prototype.resize = function(t, e) { this.w = t, this.h = e;
                    for (var s = 0; s < this.shelves.length; s++) this.shelves[s].resize(t);
                    return !0 }, e.prototype.alloc = function(t, e) {
                    if (t > this.free || e > this.h) return null;
                    var s = this.x;
                    return this.x += t, this.free -= t, { x: s, y: this.y, w: t, h: e, width: t, height: e } }, e.prototype.resize = function(t) {
                    return this.free += t - this.w, this.w = t, !0 }, t });
        }, {}],
        195: [function(require, module, exports) {
            "use strict";

            function supercluster(t) {
                return new SuperCluster(t) }

            function SuperCluster(t) { this.options = extend(Object.create(this.options), t), this.trees = new Array(this.options.maxZoom + 1) }

            function createCluster(t, e, o, n) {
                return { x: t, y: e, zoom: 1 / 0, id: n, numPoints: o } }

            function createPointCluster(t, e) {
                var o = t.geometry.coordinates;
                return createCluster(lngX(o[0]), latY(o[1]), 1, e) }

            function getClusterJSON(t) {
                return { type: "Feature", properties: getClusterProperties(t), geometry: { type: "Point", coordinates: [xLng(t.x), yLat(t.y)] } } }

            function getClusterProperties(t) {
                var e = t.numPoints,
                    o = e >= 1e4 ? Math.round(e / 1e3) + "k" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : e;
                return { cluster: !0, point_count: e, point_count_abbreviated: o } }

            function lngX(t) {
                return t / 360 + .5 }

            function latY(t) {
                var e = Math.sin(t * Math.PI / 180),
                    o = .5 - .25 * Math.log((1 + e) / (1 - e)) / Math.PI;
                return o < 0 ? 0 : o > 1 ? 1 : o }

            function xLng(t) {
                return 360 * (t - .5) }

            function yLat(t) {
                var e = (180 - 360 * t) * Math.PI / 180;
                return 360 * Math.atan(Math.exp(e)) / Math.PI - 90 }

            function extend(t, e) {
                for (var o in e) t[o] = e[o];
                return t }

            function getX(t) {
                return t.x }

            function getY(t) {
                return t.y }
            var kdbush = require("kdbush");
            module.exports = supercluster, SuperCluster.prototype = { options: { minZoom: 0, maxZoom: 16, radius: 40, extent: 512, nodeSize: 64, log: !1 }, load: function(t) {
                    var e = this.options.log;
                    e && console.time("total time");
                    var o = "prepare " + t.length + " points";
                    e && console.time(o), this.points = t;
                    var n = t.map(createPointCluster);
                    e && console.timeEnd(o);
                    for (var r = this.options.maxZoom; r >= this.options.minZoom; r--) {
                        var i = +Date.now();
                        this.trees[r + 1] = kdbush(n, getX, getY, this.options.nodeSize, Float32Array), n = this._cluster(n, r), e && console.log("z%d: %d clusters in %dms", r, n.length, +Date.now() - i) }
                    return this.trees[this.options.minZoom] = kdbush(n, getX, getY, this.options.nodeSize, Float32Array), e && console.timeEnd("total time"), this }, getClusters: function(t, e) {
                    for (var o = this.trees[this._limitZoom(e)], n = o.range(lngX(t[0]), latY(t[3]), lngX(t[2]), latY(t[1])), r = [], i = 0; i < n.length; i++) {
                        var s = o.points[n[i]];
                        r.push(s.id !== -1 ? this.points[s.id] : getClusterJSON(s)) }
                    return r }, getTile: function(t, e, o) {
                    var n = this.trees[this._limitZoom(t)],
                        r = Math.pow(2, t),
                        i = this.options.extent,
                        s = this.options.radius,
                        u = s / i,
                        a = (o - u) / r,
                        h = (o + 1 + u) / r,
                        l = { features: [] };
                    return this._addTileFeatures(n.range((e - u) / r, a, (e + 1 + u) / r, h), n.points, e, o, r, l), 0 === e && this._addTileFeatures(n.range(1 - u / r, a, 1, h), n.points, r, o, r, l), e === r - 1 && this._addTileFeatures(n.range(0, a, u / r, h), n.points, -1, o, r, l), l.features.length ? l : null }, _addTileFeatures: function(t, e, o, n, r, i) {
                    for (var s = 0; s < t.length; s++) {
                        var u = e[t[s]];
                        i.features.push({ type: 1, geometry: [
                                [Math.round(this.options.extent * (u.x * r - o)), Math.round(this.options.extent * (u.y * r - n))]
                            ], tags: u.id !== -1 ? this.points[u.id].properties : getClusterProperties(u) }) } }, _limitZoom: function(t) {
                    return Math.max(this.options.minZoom, Math.min(t, this.options.maxZoom + 1)) }, _cluster: function(t, e) {
                    for (var o = [], n = this.options.radius / (this.options.extent * Math.pow(2, e)), r = 0; r < t.length; r++) {
                        var i = t[r];
                        if (!(i.zoom <= e)) { i.zoom = e;
                            for (var s = this.trees[e + 1], u = s.within(i.x, i.y, n), a = !1, h = i.numPoints, l = i.x * h, p = i.y * h, m = 0; m < u.length; m++) {
                                var c = s.points[u[m]];
                                e < c.zoom && (a = !0, c.zoom = e, l += c.x * c.numPoints, p += c.y * c.numPoints, h += c.numPoints) }
                            o.push(a ? createCluster(l / h, p / h, h, -1) : i) } }
                    return o } };
        }, { "kdbush": 196 }],
        196: [function(require, module, exports) {
            "use strict";

            function kdbush(t, i, e, s, n) {
                return new KDBush(t, i, e, s, n) }

            function KDBush(t, i, e, s, n) { i = i || defaultGetX, e = e || defaultGetY, n = n || Array, this.nodeSize = s || 64, this.points = t, this.ids = new n(t.length), this.coords = new n(2 * t.length);
                for (var r = 0; r < t.length; r++) this.ids[r] = r, this.coords[2 * r] = i(t[r]), this.coords[2 * r + 1] = e(t[r]);
                sort(this.ids, this.coords, this.nodeSize, 0, this.ids.length - 1, 0) }

            function defaultGetX(t) {
                return t[0] }

            function defaultGetY(t) {
                return t[1] }
            var sort = require("./sort"),
                range = require("./range"),
                within = require("./within");
            module.exports = kdbush, KDBush.prototype = { range: function(t, i, e, s) {
                    return range(this.ids, this.coords, t, i, e, s, this.nodeSize) }, within: function(t, i, e) {
                    return within(this.ids, this.coords, t, i, e, this.nodeSize) } };
        }, { "./range": 197, "./sort": 198, "./within": 199 }],
        197: [function(require, module, exports) {
            "use strict";

            function range(p, r, s, u, h, e, o) {
                for (var a, t, n = [0, p.length - 1, 0], f = []; n.length;) {
                    var l = n.pop(),
                        v = n.pop(),
                        g = n.pop();
                    if (v - g <= o)
                        for (var i = g; i <= v; i++) a = r[2 * i], t = r[2 * i + 1], a >= s && a <= h && t >= u && t <= e && f.push(p[i]);
                    else {
                        var c = Math.floor((g + v) / 2);
                        a = r[2 * c], t = r[2 * c + 1], a >= s && a <= h && t >= u && t <= e && f.push(p[c]);
                        var d = (l + 1) % 2;
                        (0 === l ? s <= a : u <= t) && (n.push(g), n.push(c - 1), n.push(d)), (0 === l ? h >= a : e >= t) && (n.push(c + 1), n.push(v), n.push(d)) } }
                return f }
            module.exports = range;
        }, {}],
        198: [function(require, module, exports) {
            "use strict";

            function sortKD(t, a, o, s, r, e) {
                if (!(r - s <= o)) {
                    var f = Math.floor((s + r) / 2);
                    select(t, a, f, s, r, e % 2), sortKD(t, a, o, s, f - 1, e + 1), sortKD(t, a, o, f + 1, r, e + 1) } }

            function select(t, a, o, s, r, e) {
                for (; r > s;) {
                    if (r - s > 600) {
                        var f = r - s + 1,
                            p = o - s + 1,
                            w = Math.log(f),
                            m = .5 * Math.exp(2 * w / 3),
                            n = .5 * Math.sqrt(w * m * (f - m) / f) * (p - f / 2 < 0 ? -1 : 1),
                            c = Math.max(s, Math.floor(o - p * m / f + n)),
                            h = Math.min(r, Math.floor(o + (f - p) * m / f + n));
                        select(t, a, o, c, h, e) }
                    var i = a[2 * o + e],
                        l = s,
                        M = r;
                    for (swapItem(t, a, s, o), a[2 * r + e] > i && swapItem(t, a, s, r); l < M;) {
                        for (swapItem(t, a, l, M), l++, M--; a[2 * l + e] < i;) l++;
                        for (; a[2 * M + e] > i;) M-- }
                    a[2 * s + e] === i ? swapItem(t, a, s, M) : (M++, swapItem(t, a, M, r)), M <= o && (s = M + 1), o <= M && (r = M - 1) } }

            function swapItem(t, a, o, s) { swap(t, o, s), swap(a, 2 * o, 2 * s), swap(a, 2 * o + 1, 2 * s + 1) }

            function swap(t, a, o) {
                var s = t[a];
                t[a] = t[o], t[o] = s }
            module.exports = sortKD;
        }, {}],
        199: [function(require, module, exports) {
            "use strict";

            function within(s, p, r, t, u, h) {
                for (var i = [0, s.length - 1, 0], o = [], n = u * u; i.length;) {
                    var e = i.pop(),
                        a = i.pop(),
                        f = i.pop();
                    if (a - f <= h)
                        for (var v = f; v <= a; v++) sqDist(p[2 * v], p[2 * v + 1], r, t) <= n && o.push(s[v]);
                    else {
                        var l = Math.floor((f + a) / 2),
                            c = p[2 * l],
                            q = p[2 * l + 1];
                        sqDist(c, q, r, t) <= n && o.push(s[l]);
                        var D = (e + 1) % 2;
                        (0 === e ? r - u <= c : t - u <= q) && (i.push(f), i.push(l - 1), i.push(D)), (0 === e ? r + u >= c : t + u >= q) && (i.push(l + 1), i.push(a), i.push(D)) } }
                return o }

            function sqDist(s, p, r, t) {
                var u = s - r,
                    h = p - t;
                return u * u + h * h }
            module.exports = within;
        }, {}],
        200: [function(require, module, exports) {
            "use strict";

            function TinyQueue(t, i) {
                if (!(this instanceof TinyQueue)) return new TinyQueue(t, i);
                if (this.data = t || [], this.length = this.data.length, this.compare = i || defaultCompare, t)
                    for (var a = Math.floor(this.length / 2); a >= 0; a--) this._down(a) }

            function defaultCompare(t, i) {
                return t < i ? -1 : t > i ? 1 : 0 }

            function swap(t, i, a) {
                var n = t[i];
                t[i] = t[a], t[a] = n }
            module.exports = TinyQueue, TinyQueue.prototype = { push: function(t) { this.data.push(t), this.length++, this._up(this.length - 1) }, pop: function() {
                    var t = this.data[0];
                    return this.data[0] = this.data[this.length - 1], this.length--, this.data.pop(), this._down(0), t }, peek: function() {
                    return this.data[0] }, _up: function(t) {
                    for (var i = this.data, a = this.compare; t > 0;) {
                        var n = Math.floor((t - 1) / 2);
                        if (!(a(i[t], i[n]) < 0)) break;
                        swap(i, n, t), t = n } }, _down: function(t) {
                    for (var i = this.data, a = this.compare, n = this.length;;) {
                        var e = 2 * t + 1,
                            h = e + 1,
                            s = t;
                        if (e < n && a(i[e], i[s]) < 0 && (s = e), h < n && a(i[h], i[s]) < 0 && (s = h), s === t) return;
                        swap(i, s, t), t = s } } };
        }, {}],
        201: [function(require, module, exports) {
            function UnitBezier(t, i, e, r) { this.cx = 3 * t, this.bx = 3 * (e - t) - this.cx, this.ax = 1 - this.cx - this.bx, this.cy = 3 * i, this.by = 3 * (r - i) - this.cy, this.ay = 1 - this.cy - this.by, this.p1x = t, this.p1y = r, this.p2x = e, this.p2y = r }
            module.exports = UnitBezier, UnitBezier.prototype.sampleCurveX = function(t) {
                return ((this.ax * t + this.bx) * t + this.cx) * t }, UnitBezier.prototype.sampleCurveY = function(t) {
                return ((this.ay * t + this.by) * t + this.cy) * t }, UnitBezier.prototype.sampleCurveDerivativeX = function(t) {
                return (3 * this.ax * t + 2 * this.bx) * t + this.cx }, UnitBezier.prototype.solveCurveX = function(t, i) { "undefined" == typeof i && (i = 1e-6);
                var e, r, s, h, n;
                for (s = t, n = 0; n < 8; n++) {
                    if (h = this.sampleCurveX(s) - t, Math.abs(h) < i) return s;
                    var u = this.sampleCurveDerivativeX(s);
                    if (Math.abs(u) < 1e-6) break;
                    s -= h / u }
                if (e = 0, r = 1, s = t, s < e) return e;
                if (s > r) return r;
                for (; e < r;) {
                    if (h = this.sampleCurveX(s), Math.abs(h - t) < i) return s;
                    t > h ? e = s : r = s, s = .5 * (r - e) + e }
                return s }, UnitBezier.prototype.solve = function(t, i) {
                return this.sampleCurveY(this.solveCurveX(t, i)) };
        }, {}],
        202: [function(require, module, exports) {
            module.exports.VectorTile = require("./lib/vectortile.js"), module.exports.VectorTileFeature = require("./lib/vectortilefeature.js"), module.exports.VectorTileLayer = require("./lib/vectortilelayer.js");
        }, { "./lib/vectortile.js": 203, "./lib/vectortilefeature.js": 204, "./lib/vectortilelayer.js": 205 }],
        203: [function(require, module, exports) {
            "use strict";

            function VectorTile(e, r) { this.layers = e.readFields(readTile, {}, r) }

            function readTile(e, r, i) {
                if (3 === e) {
                    var t = new VectorTileLayer(i, i.readVarint() + i.pos);
                    t.length && (r[t.name] = t) } }
            var VectorTileLayer = require("./vectortilelayer");
            module.exports = VectorTile;
        }, { "./vectortilelayer": 205 }],
        204: [function(require, module, exports) {
            "use strict";

            function VectorTileFeature(e, t, r, i, a) { this.properties = {}, this.extent = r, this.type = 0, this._pbf = e, this._geometry = -1, this._keys = i, this._values = a, e.readFields(readFeature, this, t) }

            function readFeature(e, t, r) { 1 == e ? t.id = r.readVarint() : 2 == e ? readTag(r, t) : 3 == e ? t.type = r.readVarint() : 4 == e && (t._geometry = r.pos) }

            function readTag(e, t) {
                for (var r = e.readVarint() + e.pos; e.pos < r;) {
                    var i = t._keys[e.readVarint()],
                        a = t._values[e.readVarint()];
                    t.properties[i] = a } }

            function classifyRings(e) {
                var t = e.length;
                if (t <= 1) return [e];
                for (var r, i, a = [], o = 0; o < t; o++) {
                    var n = signedArea(e[o]);
                    0 !== n && (void 0 === i && (i = n < 0), i === n < 0 ? (r && a.push(r), r = [e[o]]) : r.push(e[o])) }
                return r && a.push(r), a }

            function signedArea(e) {
                for (var t, r, i = 0, a = 0, o = e.length, n = o - 1; a < o; n = a++) t = e[a], r = e[n], i += (r.x - t.x) * (t.y + r.y);
                return i }
            var Point = require("point-geometry");
            module.exports = VectorTileFeature, VectorTileFeature.types = ["Unknown", "Point", "LineString", "Polygon"], VectorTileFeature.prototype.loadGeometry = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t, r = e.readVarint() + e.pos, i = 1, a = 0, o = 0, n = 0, s = []; e.pos < r;) {
                    if (!a) {
                        var p = e.readVarint();
                        i = 7 & p, a = p >> 3 }
                    if (a--, 1 === i || 2 === i) o += e.readSVarint(), n += e.readSVarint(), 1 === i && (t && s.push(t), t = []), t.push(new Point(o, n));
                    else {
                        if (7 !== i) throw new Error("unknown command " + i);
                        t && t.push(t[0].clone()) } }
                return t && s.push(t), s }, VectorTileFeature.prototype.bbox = function() {
                var e = this._pbf;
                e.pos = this._geometry;
                for (var t = e.readVarint() + e.pos, r = 1, i = 0, a = 0, o = 0, n = 1 / 0, s = -(1 / 0), p = 1 / 0, h = -(1 / 0); e.pos < t;) {
                    if (!i) {
                        var u = e.readVarint();
                        r = 7 & u, i = u >> 3 }
                    if (i--, 1 === r || 2 === r) a += e.readSVarint(), o += e.readSVarint(), a < n && (n = a), a > s && (s = a), o < p && (p = o), o > h && (h = o);
                    else if (7 !== r) throw new Error("unknown command " + r) }
                return [n, p, s, h] }, VectorTileFeature.prototype.toGeoJSON = function(e, t, r) {
                function i(e) {
                    for (var t = 0; t < e.length; t++) {
                        var r = e[t],
                            i = 180 - 360 * (r.y + p) / n;
                        e[t] = [360 * (r.x + s) / n - 180, 360 / Math.PI * Math.atan(Math.exp(i * Math.PI / 180)) - 90] } }
                var a, o, n = this.extent * Math.pow(2, r),
                    s = this.extent * e,
                    p = this.extent * t,
                    h = this.loadGeometry(),
                    u = VectorTileFeature.types[this.type];
                switch (this.type) {
                    case 1:
                        var d = [];
                        for (a = 0; a < h.length; a++) d[a] = h[a][0];
                        h = d, i(h);
                        break;
                    case 2:
                        for (a = 0; a < h.length; a++) i(h[a]);
                        break;
                    case 3:
                        for (h = classifyRings(h), a = 0; a < h.length; a++)
                            for (o = 0; o < h[a].length; o++) i(h[a][o]) }
                1 === h.length ? h = h[0] : u = "Multi" + u;
                var f = { type: "Feature", geometry: { type: u, coordinates: h }, properties: this.properties };
                return "id" in this && (f.id = this.id), f };
        }, { "point-geometry": 192 }],
        205: [function(require, module, exports) {
            "use strict";

            function VectorTileLayer(e, t) { this.version = 1, this.name = null, this.extent = 4096, this.length = 0, this._pbf = e, this._keys = [], this._values = [], this._features = [], e.readFields(readLayer, this, t), this.length = this._features.length }

            function readLayer(e, t, r) { 15 === e ? t.version = r.readVarint() : 1 === e ? t.name = r.readString() : 5 === e ? t.extent = r.readVarint() : 2 === e ? t._features.push(r.pos) : 3 === e ? t._keys.push(r.readString()) : 4 === e && t._values.push(readValueMessage(r)) }

            function readValueMessage(e) {
                for (var t = null, r = e.readVarint() + e.pos; e.pos < r;) {
                    var a = e.readVarint() >> 3;
                    t = 1 === a ? e.readString() : 2 === a ? e.readFloat() : 3 === a ? e.readDouble() : 4 === a ? e.readVarint64() : 5 === a ? e.readVarint() : 6 === a ? e.readSVarint() : 7 === a ? e.readBoolean() : null }
                return t }
            var VectorTileFeature = require("./vectortilefeature.js");
            module.exports = VectorTileLayer, VectorTileLayer.prototype.feature = function(e) {
                if (e < 0 || e >= this._features.length) throw new Error("feature index out of bounds");
                this._pbf.pos = this._features[e];
                var t = this._pbf.readVarint() + this._pbf.pos;
                return new VectorTileFeature(this._pbf, t, this.extent, this._keys, this._values) };
        }, { "./vectortilefeature.js": 204 }],
        206: [function(require, module, exports) {
            function fromVectorTileJs(e) {
                var r = [];
                for (var o in e.layers) r.push(prepareLayer(e.layers[o]));
                var t = new Pbf;
                return vtpb.tile.write({ layers: r }, t), t.finish() }

            function fromGeojsonVt(e) {
                var r = {};
                for (var o in e) r[o] = new GeoJSONWrapper(e[o].features), r[o].name = o;
                return fromVectorTileJs({ layers: r }) }

            function prepareLayer(e) {
                for (var r = { name: e.name || "", version: e.version || 1, extent: e.extent || 4096, keys: [], values: [], features: [] }, o = {}, t = {}, n = 0; n < e.length; n++) {
                    var a = e.feature(n);
                    a.geometry = encodeGeometry(a.loadGeometry());
                    var u = [];
                    for (var s in a.properties) {
                        var i = o[s]; "undefined" == typeof i && (r.keys.push(s), i = r.keys.length - 1, o[s] = i);
                        var p = wrapValue(a.properties[s]),
                            l = t[p.key]; "undefined" == typeof l && (r.values.push(p), l = r.values.length - 1, t[p.key] = l), u.push(i), u.push(l) }
                    a.tags = u, r.features.push(a) }
                return r }

            function command(e, r) {
                return (r << 3) + (7 & e) }

            function zigzag(e) {
                return e << 1 ^ e >> 31 }

            function encodeGeometry(e) {
                for (var r = [], o = 0, t = 0, n = e.length, a = 0; a < n; a++) {
                    var u = e[a];
                    r.push(command(1, 1));
                    for (var s = 0; s < u.length; s++) { 1 === s && r.push(command(2, u.length - 1));
                        var i = u[s].x - o,
                            p = u[s].y - t;
                        r.push(zigzag(i), zigzag(p)), o += i, t += p } }
                return r }

            function wrapValue(e) {
                var r, o = typeof e;
                return "string" === o ? r = { string_value: e } : "boolean" === o ? r = { bool_value: e } : "number" === o ? r = e % 1 !== 0 ? { double_value: e } : e < 0 ? { sint_value: e } : { uint_value: e } : (e = JSON.stringify(e), r = { string_value: e }), r.key = o + ":" + e, r }
            var Pbf = require("pbf"),
                vtpb = require("./vector-tile-pb"),
                GeoJSONWrapper = require("./lib/geojson_wrapper");
            module.exports = fromVectorTileJs, module.exports.fromVectorTileJs = fromVectorTileJs, module.exports.fromGeojsonVt = fromGeojsonVt, module.exports.GeoJSONWrapper = GeoJSONWrapper;
        }, { "./lib/geojson_wrapper": 207, "./vector-tile-pb": 208, "pbf": 190 }],
        207: [function(require, module, exports) {
            "use strict";

            function GeoJSONWrapper(e) { this.features = e, this.length = e.length }

            function FeatureWrapper(e) { this.id = "number" == typeof e.id ? e.id : void 0, this.type = e.type, this.rawGeometry = 1 === e.type ? [e.geometry] : e.geometry, this.properties = e.tags, this.extent = 4096 }
            var Point = require("point-geometry"),
                VectorTileFeature = require("vector-tile").VectorTileFeature;
            module.exports = GeoJSONWrapper, GeoJSONWrapper.prototype.feature = function(e) {
                return new FeatureWrapper(this.features[e]) }, FeatureWrapper.prototype.loadGeometry = function() {
                var e = this.rawGeometry;
                this.geometry = [];
                for (var t = 0; t < e.length; t++) {
                    for (var r = e[t], o = [], a = 0; a < r.length; a++) o.push(new Point(r[a][0], r[a][1]));
                    this.geometry.push(o) }
                return this.geometry }, FeatureWrapper.prototype.bbox = function() { this.geometry || this.loadGeometry();
                for (var e = this.geometry, t = 1 / 0, r = -(1 / 0), o = 1 / 0, a = -(1 / 0), i = 0; i < e.length; i++)
                    for (var p = e[i], n = 0; n < p.length; n++) {
                        var h = p[n];
                        t = Math.min(t, h.x), r = Math.max(r, h.x), o = Math.min(o, h.y), a = Math.max(a, h.y) }
                return [t, o, r, a] }, FeatureWrapper.prototype.toGeoJSON = VectorTileFeature.prototype.toGeoJSON;
        }, { "point-geometry": 192, "vector-tile": 202 }],
        208: [function(require, module, exports) {
            "use strict";

            function readTile(e, r) {
                return e.readFields(readTileField, { layers: [] }, r) }

            function readTileField(e, r, i) { 3 === e && r.layers.push(readLayer(i, i.readVarint() + i.pos)) }

            function writeTile(e, r) {
                var i;
                if (void 0 !== e.layers)
                    for (i = 0; i < e.layers.length; i++) r.writeMessage(3, writeLayer, e.layers[i]) }

            function readValue(e, r) {
                return e.readFields(readValueField, {}, r) }

            function readValueField(e, r, i) { 1 === e ? r.string_value = i.readString() : 2 === e ? r.float_value = i.readFloat() : 3 === e ? r.double_value = i.readDouble() : 4 === e ? r.int_value = i.readVarint() : 5 === e ? r.uint_value = i.readVarint() : 6 === e ? r.sint_value = i.readSVarint() : 7 === e && (r.bool_value = i.readBoolean()) }

            function writeValue(e, r) { void 0 !== e.string_value && r.writeStringField(1, e.string_value), void 0 !== e.float_value && r.writeFloatField(2, e.float_value), void 0 !== e.double_value && r.writeDoubleField(3, e.double_value), void 0 !== e.int_value && r.writeVarintField(4, e.int_value), void 0 !== e.uint_value && r.writeVarintField(5, e.uint_value), void 0 !== e.sint_value && r.writeSVarintField(6, e.sint_value), void 0 !== e.bool_value && r.writeBooleanField(7, e.bool_value) }

            function readFeature(e, r) {
                var i = e.readFields(readFeatureField, {}, r);
                return void 0 === i.type && (i.type = "Unknown"), i }

            function readFeatureField(e, r, i) { 1 === e ? r.id = i.readVarint() : 2 === e ? r.tags = i.readPackedVarint() : 3 === e ? r.type = i.readVarint() : 4 === e && (r.geometry = i.readPackedVarint()) }

            function writeFeature(e, r) { void 0 !== e.id && r.writeVarintField(1, e.id), void 0 !== e.tags && r.writePackedVarint(2, e.tags), void 0 !== e.type && r.writeVarintField(3, e.type), void 0 !== e.geometry && r.writePackedVarint(4, e.geometry) }

            function readLayer(e, r) {
                return e.readFields(readLayerField, { features: [], keys: [], values: [] }, r) }

            function readLayerField(e, r, i) { 15 === e ? r.version = i.readVarint() : 1 === e ? r.name = i.readString() : 2 === e ? r.features.push(readFeature(i, i.readVarint() + i.pos)) : 3 === e ? r.keys.push(i.readString()) : 4 === e ? r.values.push(readValue(i, i.readVarint() + i.pos)) : 5 === e && (r.extent = i.readVarint()) }

            function writeLayer(e, r) { void 0 !== e.version && r.writeVarintField(15, e.version), void 0 !== e.name && r.writeStringField(1, e.name);
                var i;
                if (void 0 !== e.features)
                    for (i = 0; i < e.features.length; i++) r.writeMessage(2, writeFeature, e.features[i]);
                if (void 0 !== e.keys)
                    for (i = 0; i < e.keys.length; i++) r.writeStringField(3, e.keys[i]);
                if (void 0 !== e.values)
                    for (i = 0; i < e.values.length; i++) r.writeMessage(4, writeValue, e.values[i]);
                void 0 !== e.extent && r.writeVarintField(5, e.extent) }
            var tile = exports.tile = { read: readTile, write: writeTile };
            tile.GeomType = { Unknown: 0, Point: 1, LineString: 2, Polygon: 3 }, tile.value = { read: readValue, write: writeValue }, tile.feature = { read: readFeature, write: writeFeature }, tile.layer = { read: readLayer, write: writeLayer };
        }, {}],
        209: [function(require, module, exports) {
            var bundleFn = arguments[3],
                sources = arguments[4],
                cache = arguments[5],
                stringify = JSON.stringify;
            module.exports = function(r, e) {
                function t(r) { d[r] = !0;
                    for (var e in sources[r][1]) {
                        var n = sources[r][1][e];
                        d[n] || t(n) } }
                for (var n, o = Object.keys(cache), a = 0, i = o.length; a < i; a++) {
                    var s = o[a],
                        u = cache[s].exports;
                    if (u === r || u && u.default === r) { n = s;
                        break } }
                if (!n) { n = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    for (var f = {}, a = 0, i = o.length; a < i; a++) {
                        var s = o[a];
                        f[s] = s }
                    sources[n] = [Function(["require", "module", "exports"], "(" + r + ")(self)"), f] }
                var c = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                    l = {};
                l[n] = n, sources[c] = [Function(["require"], "var f = require(" + stringify(n) + ");(f.default ? f.default : f)(self);"), l];
                var d = {};
                t(c);
                var g = "(" + bundleFn + ")({" + Object.keys(d).map(function(r) {
                        return stringify(r) + ":[" + sources[r][0] + "," + stringify(sources[r][1]) + "]" }).join(",") + "},{},[" + stringify(c) + "])",
                    v = window.URL || window.webkitURL || window.mozURL || window.msURL,
                    w = new Blob([g], { type: "text/javascript" });
                if (e && e.bare) return w;
                var h = v.createObjectURL(w),
                    b = new Worker(h);
                return b.objectURL = h, b };
        }, {}],
        210: [function(require, module, exports) {
            ! function(e, t) { "object" == typeof exports && "undefined" != typeof module ? t(exports) : "function" == typeof define && define.amd ? define(["exports"], t) : t(e.WhooTS = e.WhooTS || {}) }(this, function(e) {
                function t(e, t, r, n, i, s) { s = s || {};
                    var f = e + "?" + ["bbox=" + o(r, n, i), "format=" + (s.format || "image/png"), "service=" + (s.service || "WMS"), "version=" + (s.version || "1.1.1"), "request=" + (s.request || "GetMap"), "srs=" + (s.srs || "EPSG:3857"), "width=" + (s.width || 256), "height=" + (s.height || 256), "layers=" + t].join("&");
                    return f }

                function o(e, t, o) { t = Math.pow(2, o) - t - 1;
                    var n = r(256 * e, 256 * t, o),
                        i = r(256 * (e + 1), 256 * (t + 1), o);
                    return n[0] + "," + n[1] + "," + i[0] + "," + i[1] }

                function r(e, t, o) {
                    var r = 2 * Math.PI * 6378137 / 256 / Math.pow(2, o),
                        n = e * r - 2 * Math.PI * 6378137 / 2,
                        i = t * r - 2 * Math.PI * 6378137 / 2;
                    return [n, i] }
                e.getURL = t, e.getTileBBox = o, e.getMercCoords = r, Object.defineProperty(e, "__esModule", { value: !0 }) });
        }, {}],
        211: [function(require, module, exports) {
            module.exports = { "version": "0.26.0" }
        }, {}]
    }, {}, [18])(18)
});


//# sourceMappingURL=mapbox-gl.js.map