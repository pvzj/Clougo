//-------------------------------------------------------------------------------------------------------
// Copyright (C) Clougo Project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

"use strict";

var $obj = {};
$obj.create = function(logo, sys) {
    const type = {};

    const LIST_HEAD_SIZE = 2;
    const ARRAY_HEAD_SIZE = 2;
    const SRCMAP_NULL = 0;
    const LIST_ORIGIN = 1;
    const ARRAY_DEFAULT_ORIGIN = 1;
    const NEWLINE = "\n";
    const CLOSE_PAREN = ")";
    const LAMBDA_EXPR = "[]";

    type.LIST_HEAD_SIZE = LIST_HEAD_SIZE;
    type.ARRAY_HEAD_SIZE = ARRAY_HEAD_SIZE;
    type.SRCMAP_NULL = SRCMAP_NULL;
    type.LIST_ORIGIN = LIST_ORIGIN;
    type.ARRAY_DEFAULT_ORIGIN = ARRAY_DEFAULT_ORIGIN;
    type.NEWLINE = NEWLINE;
    type.CLOSE_PAREN = CLOSE_PAREN;
    type.LAMBDA_EXPR = LAMBDA_EXPR;

    const OBJTYPE = {
        MIN_VALUE: 0,
        LIST: 1,
        ARRAY: 2,
        PROC: 3,
        MAX_VALUE: 7
    };

    const PALETTE = {
        0: [0, 0, 0],
        1: [0, 0, 255],
        2: [0, 255, 0],
        3: [0, 255, 255],
        4: [255, 0, 0],
        5: [255, 0, 255],
        6: [255, 255, 0],
        15: [255, 255, 255],
        7: [155, 96, 59],
        8: [197, 136, 18],
        9: [100, 162, 64],
        10: [120, 187, 187],
        11: [255, 149, 119],
        12: [144, 113, 208],
        13: [255, 163, 0],
        14: [183, 183, 183],
    };

    const NAMED_COLOR = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 216],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [216, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50],
    };

    function makeObject(t, val) {
        if (sys.isUndefined(val)) {
            return [t];
        }

        sys.assert(Array.isArray(val));

        let ret = val.slice(0);
        ret.unshift(t);
        return ret;
    }

    function getObjType(obj) {
        return obj[0];
    }
    type.getObjType = getObjType;

    function annotateSrcmap(obj, srcmap) {
        obj[0] = srcmap;
        return obj;
    }
    type.annotateSrcmap = annotateSrcmap;

    function degToRad(deg) {
        return deg * Math.PI / 180;
    }
    type.degToRad = degToRad;

    function radToDeg(rad) {
        return rad / Math.PI * 180;
    }
    type.radToDeg = radToDeg;

    function makeLogoList(val, srcmap = SRCMAP_NULL) {
        let ret = makeObject(OBJTYPE.LIST, val);
        ret.splice(1, 0, srcmap);
        return ret;
    }
    type.makeLogoList = makeLogoList;

    function embedSrcmap(list, srcmap) {
        list[1] = srcmap;
        return list;
    }
    type.embedSrcmap = embedSrcmap;

    function getEmbeddedSrcmap(list) {
        return hasEmbeddedSrcmap(list) ? list[1] : SRCMAP_NULL;
    }
    type.getEmbeddedSrcmap = getEmbeddedSrcmap;

    function hasEmbeddedSrcmap(list) {
        return list[1] !== SRCMAP_NULL && list[1][0] !== SRCMAP_NULL;
    }
    type.hasEmbeddedSrcmap = hasEmbeddedSrcmap;

    function inSameLine(srcmap1, srcmap2) {
        return (srcmap1 !== SRCMAP_NULL && srcmap2 !== SRCMAP_NULL &&
            srcmap1[0] === srcmap2[0] && srcmap1[1] === srcmap2[1]);
    }
    type.inSameLine = inSameLine;

    function embedReferenceSrcmap(list, srcmap) {
        if (list[1] === SRCMAP_NULL) {
            list[1] = [SRCMAP_NULL];
        }

        if (Array.isArray(list[1]) && list[1] !== srcmap) {
            list[1][1] = srcmap;
        }

        return list;
    }
    type.embedReferenceSrcmap = embedReferenceSrcmap;

    function hasReferenceSrcmap(list) {
        return Array.isArray(list[1]) && list[1][1] !== SRCMAP_NULL;
    }
    type.hasReferenceSrcmap = hasReferenceSrcmap;

    function getReferenceSrcmap(list) {
        return list[1][1];
    }
    type.getReferenceSrcmap = getReferenceSrcmap;

    function makeCompList(data, topSrcmap, dataSrcmap) {
        data = makeLogoList(data);
        dataSrcmap = makeLogoList(dataSrcmap);
        dataSrcmap[0] = topSrcmap;
        embedSrcmap(data, dataSrcmap);
        return data;
    }
    type.makeCompList = makeCompList;

    function isLogoListLiteral(value) {
        return isLogoList(value) && getEmbeddedSrcmap(value) !== SRCMAP_NULL;
    }
    type.isLogoListLiteral = isLogoListLiteral;

    function isLogoObj(val) {
        return Array.isArray(val) && val.length > 0 &&
            val[0] >= OBJTYPE.MIN_VALUE & val[0] <= OBJTYPE.MAX_VALUE;
    }
    type.isLogoObj = isLogoObj;

    function isLogoList(token) {
        return (token instanceof Array && token[0] == OBJTYPE.LIST);
    }
    type.isLogoList = isLogoList;

    function isByteValue(value) {
        return sys.isInteger(value) && value >= 0 && value <= 255;
    }
    type.isByteValue = isByteValue;

    function isRGB(rgb) {
        return Array.isArray(rgb) && rgb.length == 3 &&
            isByteValue(rgb[0]) && isByteValue(rgb[1]) && isByteValue(rgb[2]);
    }
    type.isRGB = isRGB;

    function isRGBList(val) {
        return isLogoList(val) && listLength(val) == 3 &&
            isByteValue(listItem(1, val)) && isByteValue(listItem(2, val)) && isByteValue(listItem(3, val));
    }
    type.isRGBList = isRGBList;

    function isPaletteIndex(color) {
        return color in PALETTE;
    }
    type.isPaletteIndex = isPaletteIndex;

    function getPaletteRGB(index) {
        return PALETTE[index];
    }
    type.getPaletteRGB = getPaletteRGB;

    function isNamedColor(color) {
        return typeof color === "string" && color.toLowerCase() in NAMED_COLOR;
    }
    type.isNamedColor = isNamedColor;

    function isColor(color) {
        return isPaletteIndex(color) || logo.type.isRGBList(color) || isNamedColor(color);
    }
    type.isColor = isColor;

    function isEmptyString(value) {
        return typeof value === "string" && value.length === 0;
    }
    type.isEmptyString = isEmptyString;

    function isEmptyList(value) {
        return isLogoList(value) && listLength(value) === 0;
    }
    type.isEmptyList = isEmptyList;

    function getRGB(color) {
        if (isPaletteIndex(color)) {
            return logo.type.getPaletteRGB(color);
        }

        if (isNamedColor(color)) {
            return NAMED_COLOR[color];
        }

        sys.assert(isRGBList(color));
        return unbox(color);
    }
    type.getRGB = getRGB;

    function listFirst(list) {
        return listItem(LIST_ORIGIN, list);
    }
    type.listFirst = listFirst;

    function listButFirst(list) {
        let ret = list.slice(0);
        let embeddedSrcmap = getEmbeddedSrcmap(list);

        ret.splice(LIST_HEAD_SIZE, 1);
        if (embeddedSrcmap === SRCMAP_NULL) {
            return ret;
        }

        embeddedSrcmap = embeddedSrcmap.slice(0);
        embeddedSrcmap.splice(LIST_HEAD_SIZE, 1);
        return embedSrcmap(ret, embeddedSrcmap);
    }
    type.listButFirst = listButFirst;

    function listButLast(list) {
        return makeLogoList(list.slice(LIST_HEAD_SIZE, list.length - 1));
    }
    type.listButLast = listButLast;

    function listMaxIndex(list) {
        return list.length - LIST_HEAD_SIZE;
    }
    type.listMaxIndex = listMaxIndex;

    function listIndexWithinRange(index, list) {
        return index >= type.LIST_ORIGIN && index <= listMaxIndex(list);
    }
    type.listIndexWithinRange = listIndexWithinRange;

    function listSetItem(index, list, val) {
        list[index + LIST_HEAD_SIZE - LIST_ORIGIN] = val;
    }
    type.listSetItem = listSetItem;

    function listItem(index, list) {
        return list[index + LIST_HEAD_SIZE - LIST_ORIGIN];
    }
    type.listItem = listItem;

    function listLength(list) {
        return list.length - LIST_HEAD_SIZE;
    }
    type.listLength = listLength;

    function listEqual(a, b) {
        let maxIndex = listMaxIndex(a);
        if (maxIndex !== listMaxIndex(b)) {
            return false;
        }

        for (let i = LIST_ORIGIN; i <= maxIndex; i++) {
            if (!equal(listItem(i, a), listItem(i, b))) {
                return false;
            }
        }

        return true;
    }
    type.listEqual = listEqual;

    function booleanEqual(a, b) {
        return isLogoBoolean(a) && isLogoBoolean(b) && logoBoolean(a) === logoBoolean(b);
    }
    type.booleanEqual = booleanEqual;

    function arrayOrigin(array) {
        return array[1];
    }
    type.arrayOrigin = arrayOrigin;

    function arrayMaxIndex(array) {
        return arrayOrigin(array) + array.length - ARRAY_HEAD_SIZE - 1;
    }
    type.arrayMaxIndex = arrayMaxIndex;

    function arrayIndexWithinRange(index, array) {
        return index >= arrayOrigin(array) && index <= arrayMaxIndex(array);
    }
    type.arrayIndexWithinRange = arrayIndexWithinRange;

    function arraySetItem(index, array, val) {
        array[index - arrayOrigin(array) + 2] = val;
    }
    type.arraySetItem = arraySetItem;

    function arrayItem(index, array) {
        return array[index - arrayOrigin(array) + 2];
    }
    type.arrayItem = arrayItem;

    function arrayLength(array) {
        return array.length - ARRAY_HEAD_SIZE;
    }
    type.arrayLength = arrayLength;

    const length = (() => {
        const getLengthHelper = {};

        getLengthHelper[OBJTYPE.LIST] = listLength;
        getLengthHelper[OBJTYPE.ARRAY] = arrayLength;

        return function(thing) {
            if (isLogoWord(thing)) {
                return 1;
            }

            sys.assert(isLogoObj(thing) && thing[0] in getLengthHelper);
            return getLengthHelper[thing[0]](thing);
        };
    })();
    type.length = length;

    function unboxList(list) {
        return list.slice(LIST_HEAD_SIZE);
    }
    type.unboxList = unboxList;

    function unboxArray(array) {
        return array.slice(ARRAY_HEAD_SIZE);
    }
    type.unboxArray = unboxArray;

    const unbox = (() => {
        const unboxHelper = {};

        unboxHelper[OBJTYPE.LIST] = unboxList;

        unboxHelper[OBJTYPE.ARRAY] = unboxArray;

        return function(thing) {
            if (thing === undefined || isLogoWord(thing)) {
                return thing;
            }

            sys.assert(isLogoObj(thing) && thing[0] in unboxHelper);
            return unboxHelper[thing[0]](thing);
        };
    })();
    type.unbox = unbox;

    function flattenList(iterable, separator = undefined) {
        let ret = [];

        for (let i in iterable) {
            let item = iterable[i];
            if (logo.type.isLogoWord(item)) {
                ret.push(item);
            } else {
                Array.prototype.push.apply(ret, logo.type.unboxList(item));
            }

            if (separator !== undefined) {
                ret.push(separator);
            }
        }

        return ret;
    }
    type.flattenList = flattenList;

    function makeLogoArray(val, origin = type.ARRAY_DEFAULT_ORIGIN) {
        let ret = makeObject(OBJTYPE.ARRAY, val);
        ret.splice(1, 0, origin);
        return ret;
    }
    type.makeLogoArray = makeLogoArray;

    function makeLogoArrayBySize(size, origin = type.ARRAY_DEFAULT_ORIGIN) {
        let ret = makeObject(OBJTYPE.ARRAY, Array.apply(null, Array(size)).map(() => null));
        ret.splice(1, 0, origin);
        return ret;
    }
    type.makeLogoArrayBySize = makeLogoArrayBySize;

    function isLogoArray(token) {
        return (token instanceof Array && token[0] == OBJTYPE.ARRAY);
    }
    type.isLogoArray = isLogoArray;

    function arrayToList(array) {
        let value = unboxArray(array);
        value.unshift(SRCMAP_NULL);
        value.unshift(OBJTYPE.LIST);
        return value;
    }
    type.arrayToList = arrayToList;

    function listToArray(list, origin) {
        let value = unboxList(list);
        value.unshift(origin);
        value.unshift(OBJTYPE.ARRAY);
        return value;
    }
    type.listToArray = listToArray;

    function charToAscii(word) {
        let charCode = (typeof word === "string") ? word.charCodeAt(0) : 48 + word; // typeof word === "number"
        ifTrueThenThrow(!isByteValue(charCode), type.LogoException.INVALID_INPUT, word);
        return charCode;
    }
    type.charToAscii = charToAscii;

    function asciiToChar(code) {
        return String.fromCharCode(code);
    }
    type.asciiToChar = asciiToChar;

    function makeLogoProc(val) {
        return makeObject(OBJTYPE.PROC, val);
    }
    type.makeLogoProc = makeLogoProc;

    function isLogoProc(token) {
        return (token instanceof Array && token[0] == OBJTYPE.PROC);
    }
    type.isLogoProc = isLogoProc;

    function getLogoProcName(proc) {
        return proc[1];
    }
    type.getLogoProcName = getLogoProcName;

    function getLogoProcParams(proc) {
        return proc[2];
    }
    type.getLogoProcParams = getLogoProcParams;

    function getLogoProcBody(proc) {
        return proc[3];
    }
    type.getLogoProcBody = getLogoProcBody;

    function getLogoProcBodyWithSrcmap(proc, srcmap) {
        return embedSrcmap(proc[3], srcmap[3]);
    }
    type.getLogoProcBodyWithSrcmap = getLogoProcBodyWithSrcmap;

    function isProcText(template) {
        return isLogoList(template) &&
            unboxList(template).reduce((acc, item) => acc && isLogoList(item), true);
    }
    type.isProcText = isProcText;

    function formalFromProcText(template) {
        return unboxList(listFirst(template));
    }
    type.formalFromProcText = formalFromProcText;

    function formalSrcmapFromProcText(template) {
        return !hasEmbeddedSrcmap(template) ? SRCMAP_NULL :
            unboxList(listFirst(getEmbeddedSrcmap(template)));
    }
    type.formalSrcmapFromProcText = formalSrcmapFromProcText;

    function bodyFromProcText(template) {
        return makeLogoList(flattenList(unboxList(listButFirst(template)), NEWLINE));
    }
    type.bodyFromProcText = bodyFromProcText;

    function bodySrcmapFromProcText(template) {
        return !hasEmbeddedSrcmap(template) ? SRCMAP_NULL :
            makeLogoList(flattenList(unboxList(listButFirst(getEmbeddedSrcmap(template))), SRCMAP_NULL));
    }
    type.bodySrcmapFromProcText = bodySrcmapFromProcText;

    function ifTrueThenThrow(predicate, exception, value) {
        if (predicate) {
            throw exception.withParam(
                [logo.env.getPrimitiveName(), logo.type.toString(value, true)],
                logo.env.getPrimitiveSrcmap());
        }
    }
    type.ifTrueThenThrow = ifTrueThenThrow;

    function checkMinInputCount(value) {
        ifTrueThenThrow(!(value >= logo.lrt.getPrimitiveFormal(logo.env.getPrimitiveName()).minInputCount),
            "NOT_ENOUGH_INPUTS", value);
    }
    type.checkMinInputCount = checkMinInputCount;

    function validateInputBoolean(value) {
        ifTrueThenThrow(!logo.type.isLogoBoolean(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputBoolean = validateInputBoolean;

    function validateInputWord(value) {
        ifTrueThenThrow(!logo.type.isLogoWord(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputWord = validateInputWord;

    function validateInputCharacter(value) {
        ifTrueThenThrow(!logo.type.isLogoCharacter(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputCharacter = validateInputCharacter;

    function validateInputInteger(value) {
        ifTrueThenThrow(!sys.isInteger(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputInteger = validateInputInteger;

    function validateInputNonNegInteger(value) {
        ifTrueThenThrow(!isNonNegInteger(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputNonNegInteger = validateInputNonNegInteger;

    function validateInputNumber(value) {
        ifTrueThenThrow(!logo.type.isLogoNumber(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputNumber = validateInputNumber;

    function validateNumber(value, exception, srcmap, exceptionParam) {
        if (!logo.type.isLogoNumber(value)) {
            throw exception.withParam(exceptionParam, srcmap);
        }
    }
    type.validateNumber = validateNumber;

    function validateInputNonNegNumber(value) {
        ifTrueThenThrow(!(logo.type.isLogoNumber(value) && value >= 0), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputNonNegNumber = validateInputNonNegNumber;

    function validateInputPosNumber(value) {
        ifTrueThenThrow(!(logo.type.isLogoNumber(value) && value > 0), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputPosNumber = validateInputPosNumber;

    function validateInputNonEmptyWord(value) {
        ifTrueThenThrow(!(logo.type.isLogoWord(value) && value.length >= 1), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputNonEmptyWord = validateInputNonEmptyWord;

    function validateIndexWithinWordRange(index, word) {
        ifTrueThenThrow(index < 1 || index > word.length, type.LogoException.INVALID_INPUT, index);
    }
    type.validateIndexWithinWordRange = validateIndexWithinWordRange;

    function validateInputList(value) {
        ifTrueThenThrow(!logo.type.isLogoList(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputList = validateInputList;

    function validateInputWordOrList(value) {
        ifTrueThenThrow(!logo.type.isLogoWord(value) && !logo.type.isLogoList(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputWordOrList = validateInputWordOrList;

    function validateInputNonEmptyList(value) {
        ifTrueThenThrow(!(logo.type.isLogoList(value) && logo.type.length(value) >= 1), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputNonEmptyList = validateInputNonEmptyList;

    function validateInputRGB(value) {
        ifTrueThenThrow(!logo.type.isColor(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputRGB = validateInputRGB;

    function validateInputPensize(value) {
        ifTrueThenThrow(!((sys.isInteger(value) && value > 0) || (logo.type.isLogoList(value) &&
            logo.type.length(value) == 2 && listItem(1, value) > 0 && listItem(2, value) > 0)),
        type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputPensize = validateInputPensize;

    function validateInputXY(value) {
        ifTrueThenThrow(!(logo.type.isLogoList(value) && logo.type.length(value) == 2 && logo.type.isLogoNumber(
            logo.type.listItem(1, value)) && logo.type.isLogoNumber(logo.type.listItem(2, value))),
        type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputXY = validateInputXY;

    function validateIndexWithinListRange(index, list) {
        ifTrueThenThrow(!logo.type.listIndexWithinRange(index, list), type.LogoException.INVALID_INPUT, index);
    }
    type.validateIndexWithinListRange = validateIndexWithinListRange;

    function validateInputArray(value) {
        ifTrueThenThrow(!logo.type.isLogoArray(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputArray = validateInputArray;

    function validateInputByte(value) {
        ifTrueThenThrow(!logo.type.isByteValue(value), type.LogoException.INVALID_INPUT, value);
    }
    type.validateInputByte = validateInputByte;

    function validateIndexWithinArrayRange(index, array) {
        ifTrueThenThrow(!logo.type.arrayIndexWithinRange(index, array), type.LogoException.INVALID_INPUT, index);
    }
    type.validateIndexWithinArrayRange = validateIndexWithinArrayRange;

    function isLogoWord(v){
        return typeof v === "string" || typeof v === "number" || typeof v === "boolean";
    }
    type.isLogoWord = isLogoWord;

    function isLogoCharacter(v){
        return (typeof v === "string" && v.length === 1) ||
            (sys.isInteger(v) && v >= 0 && v <= 9);
    }
    type.isLogoCharacter = isLogoCharacter;

    function wordGetItem(index, word) {
        return word[index - 1];
    }
    type.wordGetItem = wordGetItem;

    function wordFindItem(char, word) {
        return wordToString(word).indexOf(char);
    }
    type.wordFindItem = wordFindItem;

    function listFindItem(item, list) {
        let index = list.findIndex((elem, i) => i >= LIST_HEAD_SIZE && equal(item, elem));
        return (index === -1) ? -1 : index - LIST_HEAD_SIZE + LIST_ORIGIN;
    }
    type.listFindItem = listFindItem;

    function arrayFindItem(item, array) {
        let origin = arrayOrigin(array);
        let index = array.findIndex((elem, i) => i >= origin && equal(item, elem));
        return (index === -1) ? -1 : index - ARRAY_HEAD_SIZE + origin;
    }
    type.arrayFindItem = arrayFindItem;

    function wordToString(word) {
        switch (typeof word) {
        case "string": return word;
        case "number": return numberToString(word);
        case "boolean": return word ? "true" : "false";
        default: return "";
        }
    }
    type.wordToString = wordToString;

    function isLogoNumber(s) {
        return (typeof s === "number") || (typeof s === "string" && !isNaN(Number(s)));
    }
    type.isLogoNumber = isLogoNumber;

    function isQuotedLogoWord(v){
        return typeof v === "string" && v.charAt(0) === "\"";
    }
    type.isQuotedLogoWord = isQuotedLogoWord;

    function unquoteLogoWord(v) {
        return v.substring(1).replace(/\\([\(\)\[\]\{\}])/g, "$1"); // eslint-disable-line no-useless-escape
    }
    type.unquoteLogoWord = unquoteLogoWord;

    function quotedLogoWordToJsStringLiteral(str) {
        return "\"" + str.substring(1)
            .replace(/\\([^\(\)\[\]\{\}])/, "\\\\$1") // eslint-disable-line no-useless-escape
            .replace(/\\$/, "\\\\")
            .replace(/\n/g, "\\n")
            .replace(/\t/g, "\\t")
            .replace(/'/, "\\'")
            .replace(/"/g, "\\\"") + "\"";
    }
    type.quotedLogoWordToJsStringLiteral = quotedLogoWordToJsStringLiteral;

    function isLogoBoolean(token) {
        return typeof token === "boolean" || sys.equalToken(token, "true") || sys.equalToken(token, "false");
    }
    type.isLogoBoolean = isLogoBoolean;

    function logoBoolean(value) {
        return typeof value === "boolean" ? value :
            (sys.equalToken(value, "true")) ? true : false;
    }
    type.logoBoolean = logoBoolean;

    function isLogoVarRef(token) {
        return (typeof token == "string" && token.charAt(0) == ":");
    }
    type.isLogoVarRef = isLogoVarRef;

    function isLogoSlot(token) {
        return typeof token == "string" && token.match(/^\?(\d+)$/);
    }
    type.isLogoSlot = isLogoSlot;

    function isNotLogoFalse(val) {
        return val != false && val != "false";
    }
    type.isNotLogoFalse = isNotLogoFalse;

    function isLogoBooleanTrue(value, name, srcmap) {
        if (value === true || value == "true") {
            return true;
        }

        if (value === false || value == "false") {
            return false;
        }

        throw type.LogoException.INVALID_INPUT.withParam([name, logo.type.toString(value, true)],
            srcmap);
    }
    type.isLogoBooleanTrue = isLogoBooleanTrue;

    function isNonNegInteger(value) {
        return sys.isInteger(value) && value >= 0;
    }
    type.isNonNegInteger = isNonNegInteger;

    function isNumericConstant(curToken) {
        return typeof curToken !== "boolean" && typeof curToken !== "object" && !isNaN(Number(curToken));
    }
    type.isNumericConstant = isNumericConstant;

    function isStopStmt(curToken) {
        return sys.equalToken(curToken, "stop");
    }
    type.isStopStmt = isStopStmt;

    function isOutputStmt(curToken) {
        return sys.equalToken(curToken, "output") || sys.equalToken(curToken, "op");
    }
    type.isOutputStmt = isOutputStmt;

    function isOpenParen(curToken) {
        return curToken === "(";
    }
    type.isOpenParen = isOpenParen;

    function isCompoundObj(curToken) {
        return typeof curToken == "object";
    }
    type.isCompoundObj = isCompoundObj;

    function srcmapToJs(srcmap) {
        return isCompositeSrcmap(srcmap) ? compositeSrcmapToJs(srcmap) : simpleSrcmapToJs(srcmap);
    }
    type.srcmapToJs = srcmapToJs;

    function compositeSrcmapToJs(srcmap) {
        return simpleSrcmapToJs(srcmap[0]);
    }

    function simpleSrcmapToJs(srcmap) {
        if (srcmap === SRCMAP_NULL || srcmap === undefined) {
            return SRCMAP_NULL;
        }

        while (srcmap.length > 1 && Array.isArray(srcmap[1])) {
            srcmap = srcmap[1];
        }

        return JSON.stringify(srcmap);
    }

    function srcmapToString(srcmap) {
        return isCompositeSrcmap(srcmap) ? compositeSrcmapToString(srcmap) : simpleSrcmapToString(srcmap);
    }
    type.srcmapToString = srcmapToString;

    function isCompositeSrcmap(value) {
        return Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
    }
    type.isCompositeSrcmap = isCompositeSrcmap;

    function compositeSrcmapToString(srcmap) {
        return simpleSrcmapToString(srcmap[0]);
    }
    type.compositeSrcmapToString = compositeSrcmapToString;

    function simpleSrcmapToString(srcmap) {
        return srcmap[1] + "," + srcmap[2];
    }
    type.simpleSrcmapToString = simpleSrcmapToString;

    function getVarValue(varname, srcmap) {
        const curScope = logo.env.findLogoVarScope(varname);
        if (!(varname in curScope)) {
            throw type.LogoException.VAR_HAS_NO_VALUE.withParam([varname], srcmap);
        }

        return curScope[varname];
    }
    type.getVarValue = getVarValue;

    function equal(a, b) {
        if (isLogoList(a) && isLogoList(b) && listLength(a) == listLength(b)) {
            return listEqual(a, b);
        }

        if (isLogoBoolean(a) || isLogoBoolean(b)) {
            return booleanEqual(a,b);
        }

        return a == b;
    }
    type.equal = equal;

    function numberToString(num) {
        const digits = 15;
        const errDigits = 2;
        const margin = 3;

        let actual = (+(num.toPrecision(digits))).toString();
        if (actual.length + errDigits < digits ) {
            return actual;
        }

        let approx = (+(num.toPrecision(digits - errDigits))).toString();
        if (approx.length + errDigits + margin < actual.length) {
            return approx;
        }

        return actual;
    }

    function booleanToString(value) {
        return value ? "true" : "false";
    }

    function scalarToString(v) {
        return (typeof v === "number") ? numberToString(v) :
            (typeof v === "boolean") ? booleanToString(v) : v;
    }

    function toString(v, outterBracket = false) {
        if (isQuotedLogoWord(v)) {
            return unquoteLogoWord(v);
        }

        if (v === null) {
            return outterBracket ? "[]" : "";
        }

        if (!(isLogoList(v) || isLogoArray(v))) {
            return scalarToString(v);
        }

        function toStringHelper(v) {
            return type.isLogoList(v) ? "[" +  unboxList(v).map(toStringHelper).join(" ") + "]" :
                type.isLogoArray(v) ? "{" +  unboxArray(v).map(toStringHelper).join(" ") + "}" :
                    v === null ? "[]" : scalarToString(v);
        }

        return type.isLogoArray(v) || (outterBracket && type.isLogoList(v)) ? toStringHelper(v) :
            unboxList(v).map(toStringHelper).join(" ");
    }
    type.toString = toString;

    const LogoException = (() => {
        const codemap = {
            // name : code
            "NO_OUTPUT"             : 5,
            "NOT_ENOUGH_INPUTS"     : 6,
            "INVALID_INPUT"         : 7,
            "TOO_MUCH_INSIDE_PAREN" : 8,
            "UNACTIONABLE_DATUM"    : 9,
            "VAR_HAS_NO_VALUE"      : 11,
            "UNEXPECTED_TOKEN"      : 12,
            "UNKNOWN_PROC"          : 13,
            "NESTED_TO"             : 23,
            "CANT_OPEN_FILE"        : 40,
            "NOT_SAME_LENGTH"       : 1022,
            "TOO_MANY_INPUTS"       : 1023,
            "LAST_ERROR_CODE"       : 1024,
            "NO_HELP_AVAILABLE"     : 65531,
            "CUSTOM"                : 65532,
            "OUTPUT"                : 65534,
            "STOP"                  : 65535
        };

        const msgmap = {
            // code : message
            5  : "{0} didn't output to {1}",
            6  : "Not enough inputs to {0}",
            7  : "{0} doesn't like {1} as input",
            8  : "Too much inside ()'s",
            9  : "You don't say what to do with {0}",
            11 : "{0} has no value",
            12 : "Unexpected '{0}'",
            13 : "I don't know how to {0}",
            23 : "Can't use TO inside a procedure",
            40 : "I can't open file {0}",
            1022  : "Inputs of {0} have different lengths",
            1023  : "Too many inputs to {0}",
            65531 : "No help available on {0}.",
            65532 : "Can't find catch tag for {0}",
            65534 : "Can only use output inside a procedure",
            65535 : "Can only use stop inside a procedure"
        };

        const LogoException = {};

        function getCode(name) {
            return (name in codemap) ? codemap[name] : undefined;
        }
        LogoException.getCode = getCode;

        function getMessage(code) {
            return (code in msgmap) ? msgmap[code] : undefined;
        }
        LogoException.getMessage = getMessage;

        LogoException.prototype = {
            isError: function() { return this._code < codemap.LAST_ERROR_CODE; },
            isCustom: function() { return this._code == codemap.CUSTOM; },
            isStop: function() { return this._code == codemap.STOP; },
            isOutput: function() { return this._code == codemap.OUTPUT; },
            equalsByCode: function(e) { return this._code === e._code; },
            getCode: function() { return this._code; },
            getValue: function() { return this._value; },
            getSrcmap: function() { return this._srcmap; },
            withParam: function(value, srcmap) { return create(this._code, value, srcmap); },
            formatMessage: function() {
                const msg = getMessage(this._code);
                if (typeof msg !== "string") {
                    return "";
                }

                if (sys.isUndefined(this._value)) {
                    return msg;
                }

                if (!Array.isArray(this._value)) {
                    return msg.replace(/\{0\}/g, this._value);
                }

                return sys.isUndefined(this._value) ? msg :
                    msg.replace(/\{0\}/g, logo.type.toString(this._value[0], true))
                        .replace(/\{1\}/g, logo.type.toString(this._value[1], true));
            }
        };

        function create(code, value, srcmap) {
            const obj = Object.create(LogoException.prototype);
            obj._code = code;
            obj._value = value;
            obj._srcmap = srcmap;
            return obj;
        }

        LogoException.is = function(obj) {
            return obj.__proto__ === LogoException.prototype;
        };

        for (let name in codemap) {
            LogoException[name] = create(getCode(name));
        }

        return LogoException;
    })();
    type.LogoException = LogoException;

    return type;
};

if (typeof exports != "undefined") {
    exports.$obj = $obj;
}
