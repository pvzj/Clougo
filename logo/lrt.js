//-------------------------------------------------------------------------------------------------------
// Copyright (C) Clougo Project. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
//-------------------------------------------------------------------------------------------------------

// Logo's runtime library
// Runs in browser's Logo worker thread or Node's main thread

"use strict";

var $obj = {};
$obj.create = function(logo, sys) {
    const lrt = {};

    const turtle = sys.util.fromJs("./lrt/turtle.js").create(logo, sys);

    function primitivePi() {
        return Math.PI;
    }

    function primitiveCleartext() {
        logo.io.cleartext();
    }

    function primitiveList(...args) {
        return logo.type.makeLogoList(args);
    }

    function primitiveSentence(...args) {
        return logo.type.makeLogoList(logo.type.flattenList(args));
    }

    function primitiveWord(...args) {
        let word = "";
        for (let i in args) {
            let item = args[i];
            logo.type.validateInputWord(item);
            word += item;
        }

        return word;
    }

    function primitiveArray(size, origin = logo.type.ARRAY_DEFAULT_ORIGIN) {
        logo.type.validateInputNonNegInteger(size);
        logo.type.validateInputInteger(origin);
        return logo.type.makeLogoArrayBySize(size, origin);
    }

    function primitiveListToArray(value, origin = logo.type.ARRAY_DEFAULT_ORIGIN) {
        logo.type.validateInputList(value);
        logo.type.validateInputInteger(origin);
        return logo.type.listToArray(value, origin);
    }

    function primitiveArrayToList(value) {
        logo.type.validateInputArray(value);
        return logo.type.arrayToList(value);
    }

    function primitiveQuestionMark(slotNum = 1) {
        return logo.env.getSlotValue(slotNum);
    }

    function primitiveQuestionMarkRest(slotNum = 1) {
        return logo.env.getSlotRestValue(slotNum);
    }

    function primitiveHashMark() {
        return logo.env.getSlotIndex();
    }

    function primitiveAscii(value) {
        logo.type.validateInputCharacter(value);
        return logo.type.charToAscii(value);
    }

    function primitiveChar(value) {
        logo.type.validateInputByte(value);
        return logo.type.asciiToChar(value);
    }

    function mdarrayHelper(sizeList, index, maxIndex, origin) {
        let size = logo.type.listItem(index, sizeList);
        let ret = logo.type.makeLogoArrayBySize(size, origin);
        if (index != maxIndex) {
            for (let i = logo.type.arrayOrigin(ret); i <= logo.type.arrayMaxIndex(ret); i++) {
                logo.type.arraySetItem(i, ret, mdarrayHelper(sizeList, index + 1, maxIndex, origin));
            }
        }

        return ret;
    }

    function primitiveMdarray(sizeList, origin = logo.type.ARRAY_DEFAULT_ORIGIN) {
        logo.type.validateInputNonEmptyList(sizeList);
        return mdarrayHelper(sizeList, logo.type.ARRAY_DEFAULT_ORIGIN, logo.type.listMaxIndex(sizeList), origin);
    }

    function primitiveMdsetitem(indexList, array, value) {
        logo.type.validateInputNonEmptyList(indexList);
        logo.type.validateInputArray(array);

        let currentItem = array;
        let sizeListMaxIndex = logo.type.listMaxIndex(indexList);
        for (let i = logo.type.LIST_ORIGIN; i < sizeListMaxIndex; i++) {
            let index = logo.type.listItem(i, indexList);
            logo.type.validateInputArray(currentItem);
            logo.type.validateIndexWithinArrayRange(index, currentItem);
            currentItem = logo.type.arrayItem(index, currentItem);
        }

        let index = logo.type.listItem(sizeListMaxIndex, indexList);
        logo.type.validateInputArray(currentItem);
        logo.type.validateIndexWithinArrayRange(index, currentItem);
        logo.type.arraySetItem(index, currentItem, value);
    }

    function primitiveMditem(indexList, array) {
        logo.type.validateInputNonEmptyList(indexList);
        logo.type.validateInputArray(array);

        let currentItem = array;
        let origin = logo.type.arrayOrigin(array);
        let sizeListMaxIndex = logo.type.listMaxIndex(indexList);
        for (let i = logo.type.LIST_ORIGIN; i <= sizeListMaxIndex; i++) {
            let index = logo.type.listItem(i, indexList);
            logo.type.validateInputArray(currentItem);
            logo.type.validateIndexWithinArrayRange(index, currentItem);
            currentItem = logo.type.arrayItem(index, currentItem, origin);
        }

        return currentItem;
    }

    function primitiveFirst(thing) {
        if (logo.type.isLogoWord(thing)) {
            if (typeof thing === "boolean") {
                return thing ? "t" : "f";
            }

            if (typeof thing === "number") {
                thing = logo.type.toString(thing);
            }

            logo.type.validateInputNonEmptyWord(thing);
            return thing.substring(0, 1);
        }

        if (logo.type.isLogoList(thing)) {
            logo.type.validateInputNonEmptyList(thing);
            return logo.type.listFirst(thing);
        }

        logo.type.validateInputArray(thing);
        return logo.type.arrayOrigin(thing);
    }

    function primitiveLast(thing) {
        if (logo.type.isLogoWord(thing)) {
            if (typeof thing === "boolean") {
                return "e";
            }

            if (typeof thing === "number") {
                thing = logo.type.toString(thing);
            }

            logo.type.validateInputNonEmptyWord(thing);
            let length = thing.length;
            return thing.substring(length - 1, length);
        }

        logo.type.validateInputNonEmptyList(thing);
        return logo.type.listItem(logo.type.listLength(thing), thing);
    }

    function primitiveEmptyp(value) {
        return logo.type.isEmptyString(value) || logo.type.isEmptyList(value);
    }

    function primitiveWordp(thing) {
        return logo.type.isLogoWord(thing);
    }

    function primitiveNumberp(thing) {
        return logo.type.isLogoNumber(thing);
    }

    function primitiveListp(thing) {
        return logo.type.isLogoList(thing);
    }

    function primitiveArrayp(thing) {
        return logo.type.isLogoArray(thing);
    }

    function primitiveMemberp(candidate, group) {
        if (logo.type.isLogoWord(group)) {
            logo.type.validateInputCharacter(candidate);
            return logo.type.wordFindItem(candidate, group) != -1;
        }

        if (logo.type.isLogoList(group)) {
            return logo.type.listFindItem(candidate, group) != -1;
        }

        logo.type.validateInputArray(group);
        return logo.type.arrayFindItem(candidate, group) != -1;
    }

    function primitiveNamep(name) {
        logo.type.validateInputWord(name);
        let scope = logo.env.findLogoVarScope(name);
        return (name in scope) && (scope[name] !== undefined);
    }

    function primitiveThing(name) {
        logo.type.validateInputWord(name);
        return logo.type.getVarValue(logo.type.toString(name).toLowerCase(), logo.env.getPrimitiveSrcmap());
    }

    function primitiveButfirst(thing) {
        if (logo.type.isLogoWord(thing)) {
            if (typeof thing === "boolean") {
                return thing ? "rue" : "alse";
            }

            if (typeof thing === "number") {
                thing = logo.type.toString(thing);
            }

            logo.type.validateInputNonEmptyWord(thing);
            return thing.substring(1);
        }

        logo.type.validateInputNonEmptyList(thing);
        return logo.type.listButFirst(thing);
    }

    function primitiveButlast(thing) {
        if (logo.type.isLogoWord(thing)) {
            if (typeof thing === "boolean") {
                return thing ? "tru" : "fals";
            }

            if (typeof thing === "number") {
                thing = logo.type.toString(thing);
            }

            logo.type.validateInputNonEmptyWord(thing);
            return thing.substring(0, thing.length - 1);
        }

        logo.type.validateInputNonEmptyList(thing);
        return logo.type.listButLast(thing);
    }

    function primitiveRemove(thing, list) {
        if (logo.type.isLogoWord(list)) {
            let thingString = (logo.type.isLogoWord(thing)) ? logo.type.wordToString(thing) : thing;
            return logo.type.wordToString(list)
                .split("")
                .filter((c) => (c !== thingString))
                .join("");
        }

        logo.type.validateInputList(list);
        return logo.type.makeLogoList(
            logo.type.unboxList(list)
                .filter((item) => !logo.type.equal(item, thing)));
    }


    function primitiveReverse(value) {
        if (logo.type.isLogoWord(value)) {
            return logo.type.toString(value).split("").reverse().join("");
        }

        logo.type.validateInputList(value);
        return logo.type.makeLogoList(
            logo.type.unboxList(value).reverse());
    }

    function primitiveCount(thing) {
        if (logo.type.isLogoWord(thing)) {
            if (typeof thing === "boolean") {
                return thing ? 4 : 5;
            }

            if (typeof thing === "number") {
                thing = logo.type.toString(thing);
            }

            return thing.length;
        }

        if (logo.type.isLogoList(thing)) {
            return logo.type.listLength(thing);
        }

        logo.type.validateInputArray(thing);
        return logo.type.arrayLength(thing);
    }

    function primitiveFput(thing, list) {
        if (logo.type.isLogoWord(list)) {
            logo.type.validateInputCharacter(thing);
            return thing.concat(list);
        }

        logo.type.validateInputList(list);
        let newlist = list.slice(0);
        newlist.splice(logo.type.LIST_HEAD_SIZE, 0, thing);
        return newlist;
    }

    function primitiveLput(thing, list) {
        if (logo.type.isLogoWord(list)) {
            logo.type.validateInputCharacter(thing);
            return list.concat(thing);
        }

        logo.type.validateInputList(list);
        let newlist = list.slice(0);
        newlist.push(thing);
        return newlist;
    }

    function primitiveMake(varname, val) {
        logo.env.findLogoVarScope(varname)[varname.toLowerCase()] = val;
    }

    function primitiveAnd(...args) {
        args.forEach(logo.type.validateInputBoolean);
        return args.reduce((accumulator, currentValue) => accumulator && logo.type.logoBoolean(currentValue), true);
    }

    function primitiveOr(...args) {
        args.forEach(logo.type.validateInputBoolean);
        return args.reduce((accumulator, currentValue) => accumulator || logo.type.logoBoolean(currentValue), false);
    }

    function primitiveNot(value) {
        logo.type.validateInputBoolean(value);
        return !logo.type.logoBoolean(value);
    }

    function primitiveLocal(...args) {
        let ptr = logo.env._scopeStack.length - 1;

        args.forEach(varname =>
            logo.env._scopeStack[ptr][varname.toLowerCase()] = undefined);
    }

    function primitiveLocalmake(varname, val) {
        let ptr = logo.env._scopeStack.length - 1;
        logo.env._scopeStack[ptr][varname.toLowerCase()] = val;
    }

    function primitiveSetitem(index, array, val) {
        logo.type.validateInputArray(array);
        logo.type.validateInputInteger(index);
        logo.type.validateIndexWithinArrayRange(index, array);
        logo.type.arraySetItem(index, array, val);
    }

    function primitiveItem(index, thing) {
        if (logo.type.isLogoList(thing)) {
            logo.type.validateIndexWithinListRange(index, thing);
            return logo.type.listItem(index, thing);
        }

        if (logo.type.isLogoWord(thing)) {
            logo.type.validateIndexWithinWordRange(index, thing);
            return logo.type.wordGetItem(index, thing);
        }

        logo.type.validateInputArray(thing);
        logo.type.validateIndexWithinArrayRange(index, thing);
        return logo.type.arrayItem(index, thing);
    }

    function primitivePrint(...args) {
        logo.io.stdout(args.map(v => logo.type.toString(v)).join(" "));
    }

    function primitiveShow(...args) {
        logo.io.stdout(args.map(v => logo.type.toString(v, true)).join(" "));
    }

    function primitiveType(...args) {
        logo.io.stdoutn(args.map(v => logo.type.toString(v)).join(""));
    }

    function primitiveLessp(a, b) {
        return a < b;
    }

    function primitiveLessequalp(a, b) {
        return a <= b;
    }

    function primitiveGreaterp(a, b) {
        return a > b;
    }

    function primitiveGreaterequalp(a, b) {
        return a >= b;
    }

    function primitiveEqualp(a, b) {
        return logo.type.equal(a, b);
    }

    function primitiveNotequalp(a, b) {
        return !logo.type.equal(a, b);
    }

    function primitiveMinus(a) {
        return -a;
    }

    function primitiveQuotient(opnd1, opnd2) {
        return opnd1 / opnd2;
    }

    function primitiveProduct(opnd1, opnd2) {
        logo.type.validateInputNumber(opnd1);
        logo.type.validateInputNumber(opnd2);
        return opnd1 * opnd2;
    }

    function primitiveRemainder(opnd1, opnd2) {
        return opnd1 % opnd2;
    }

    function primitiveSum(...args) {
        args.forEach(logo.type.validateInputNumber);
        return args.reduce((accumulator, currentValue) =>
            accumulator + sys.toNumberIfApplicable(currentValue), 0);
    }

    function primitiveDifference(opnd1, opnd2) {
        return opnd1 - opnd2;
    }

    function primitiveSqrt(opnd) {
        logo.type.validateInputNonNegNumber(opnd);
        return Math.sqrt(opnd);
    }

    function primitivePower(base, exp) {
        logo.type.validateInputNumber(base);
        if (base < 0) {
            logo.type.validateInputInteger(exp);
        } else {
            logo.type.validateInputNumber(exp);
        }

        return Math.pow(base, exp);
    }

    function primitiveLog10(opnd) {
        logo.type.validateInputPosNumber(opnd);
        return Math.log10(opnd);
    }

    function primitiveSin(deg) {
        logo.type.validateInputNumber(deg);
        return Math.sin(logo.type.degToRad(normalizeDegree(deg)));
    }

    function primitiveCos(deg) {
        logo.type.validateInputNumber(deg);
        return Math.sin(logo.type.degToRad(normalizeDegree(deg + 90)));
    }

    function normalizeDegree(deg) {
        let degAbs = Math.abs(deg) % 360;
        let degSign = Math.sign(deg);
        if (degAbs > 180) {
            degAbs -= 180;
            degSign = -degSign;
        }

        if (degAbs > 90) {
            degAbs = 180 - degAbs;
        }

        return degSign * degAbs;
    }

    function primitiveRound(opnd) {
        logo.type.validateInputNumber(opnd);
        let sign = Math.sign(opnd);
        return sign == 0 ? 0 :
            sign > 0 ? Math.round(opnd) :
                - Math.round(-opnd);
    }

    function primitiveInt(opnd) {
        logo.type.validateInputNumber(opnd);
        let sign = Math.sign(opnd);
        return sign == 0 ? 0 :
            sign > 0 ? Math.floor(opnd) :
                - Math.floor(-opnd);
    }

    function primitiveAbs(opnd) {
        logo.type.validateInputNumber(opnd);
        return Math.abs(opnd);
    }

    function primitiveSign(opnd) {
        logo.type.validateInputNumber(opnd);
        return Math.sign(opnd);
    }

    function primitiveRandom(range) {
        return Math.floor(Math.random() * Math.floor(range));
    }

    function primitiveIseq(from, to) {
        logo.type.validateInputNumber(from);
        logo.type.validateInputNumber(to);
        if (from === to) {
            return logo.type.makeLogoList([from]);
        }

        let incr = from < to;
        let length = Math.floor(Math.abs(to - from)) + 1;
        return logo.type.makeLogoList(Array.from({length: length}, (x, i) => (incr ? i : -i) + from));
    }

    function primitiveThrow(tag, value = undefined) {
        throw logo.type.LogoException.CUSTOM.withParam([tag, value], logo.env.getPrimitiveSrcmap(), logo.env._curProc);
    }

    async function primitiveReadword() {
        return await readHelper();
    }

    async function primitiveReadlist() {
        let userInput = await readHelper();
        return logo.type.makeLogoList(userInput.split(" "));
    }

    async function readHelper() {
        if (logo.env.hasUserInput()) {
            return logo.env.getUserInput();
        }

        logo.env.prepareToBeBlocked();
        do {
            await new Promise((resolve) => {
                logo.env.registerUserInputResolver(resolve);
            });
        } while (!logo.env.hasUserInput());

        return logo.env.getUserInput();
    }

    async function primitiveApply(template, inputList) {
        return await applyHelper(template, inputList);
    }

    async function applyHelper(template, inputList, index = 1, unboxedRestList = []) {
        logo.type.validateInputList(inputList);

        let unboxedInputList = logo.type.unbox(inputList);
        let srcmap = logo.env.getPrimitiveSrcmap();
        let slot = logo.env.makeSlotObj(unboxedInputList, index, unboxedRestList);

        let inputListSrcmap = logo.type.getEmbeddedSrcmap(inputList);
        if (inputListSrcmap === logo.type.SRCMAP_NULL) {
            inputListSrcmap = srcmap;
        }

        if (logo.type.isLogoWord(template)) {
            return await logo.env.applyNamedProcedure(template, srcmap, slot, inputListSrcmap);
        }

        logo.type.validateInputList(template);

        if (logo.type.isProcText(template)) {
            return await logo.env.applyProcText(template, srcmap, slot, inputListSrcmap);
        }

        return await logo.env.applyInstrList(template, srcmap, true, slot, inputListSrcmap);
    }

    async function primitiveInvoke(template, ...inputs) {
        return await applyHelper(template, logo.type.makeLogoList(inputs));
    }

    function sameLength(lists) {
        let lengths = lists.map(list => list.length);
        return Math.max.apply(null, lengths) === Math.min.apply(null, lengths);
    }

    async function primitiveForeach(...inputs) {
        let template = inputs.pop();
        inputs.forEach(logo.type.validateInputWordOrList);
        inputs = inputs.map(input => logo.type.isLogoList(input) ? logo.type.unbox(input) :
            logo.type.toString(input).split(""));

        if (!sameLength(inputs)) {
            throw logo.type.LogoException.NOT_SAME_LENGTH.withParam(["foreach"], logo.env.getPrimitiveSrcmap());
        }

        let length = inputs[0].length;
        let srcmap = logo.env.getPrimitiveSrcmap();
        for (let i = 0; i < length; i++) {
            let retVal = await applyHelper(template, logo.type.makeLogoList(inputs.map(v => v[i])), i + 1,
                inputs.map(v => v.slice(i + 1)));

            logo.env.checkUnusedValue(retVal, srcmap);
        }
    }

    async function primitiveRepeat(count, template) {
        logo.type.validateInputPosNumber(count);
        logo.type.validateInputList(template);

        let srcmap = logo.env.getPrimitiveSrcmap();

        for (let i = 0; i < count; i++) {
            let ret = await logo.env.applyInstrList(template, srcmap);
            logo.env.checkUnusedValue(ret, srcmap);
        }
    }

    function wordTemplateToList(template) {
        return logo.type.isLogoWord(template) ? logo.type.makeLogoList([template]) : template;
    }

    function getTemplateSrcmap(template) {
        let templateSrcmap = logo.type.getEmbeddedSrcmap(template);
        return Array.isArray(templateSrcmap) ? templateSrcmap[0] : templateSrcmap;
    }

    async function callTemplate(template) {
        let srcmap = logo.env.getPrimitiveSrcmap();
        let ret = await logo.env.applyInstrList(template, srcmap,
            !logo.type.inSameLine(srcmap, getTemplateSrcmap(template)));
        logo.env.checkUnusedValue(ret, srcmap);
    }

    async function primitiveRun(template) {
        template = wordTemplateToList(template);
        logo.type.validateInputList(template);
        await callTemplate(template);
    }

    async function primitiveIf(predicate, template) {
        logo.type.validateInputBoolean(predicate);

        template = wordTemplateToList(template);
        logo.type.validateInputList(template);

        if (logo.type.logoBoolean(predicate)) {
            await callTemplate(template);
        }
    }

    async function primitiveIfelse(predicate, templateTrue, templateFalse) {
        logo.type.validateInputBoolean(predicate);

        templateTrue = wordTemplateToList(templateTrue);
        templateFalse = wordTemplateToList(templateFalse);

        logo.type.validateInputList(templateTrue);
        logo.type.validateInputList(templateFalse);

        if (logo.type.logoBoolean(predicate)) {
            await callTemplate(templateTrue);
        } else {
            await callTemplate(templateFalse);
        }
    }

    async function primitiveCatch(label, template) {
        logo.type.validateInputWord(label);
        template = wordTemplateToList(template);
        logo.type.validateInputList(template);

        try {
            let srcmap = logo.env.getPrimitiveSrcmap();
            let retVal = await logo.env.applyInstrList(template, srcmap,
                !logo.type.inSameLine(srcmap, getTemplateSrcmap(template)));
            if (logo.config.get("unusedValue")) {
                logo.env.checkUnusedValue(retVal, getTemplateSrcmap(template));
            }
        } catch(e) {
            if (logo.type.LogoException.is(e) && e.isCustom()) {
                if (sys.equalToken(label, e.getValue()[0])) {
                    return e.getValue()[1];
                }

                throw e; // rethrow if tag doesn't match label
            }

            if (!logo.type.LogoException.is(e) || logo.type.LogoException.STOP.equalsByCode(e) ||
                    logo.type.LogoException.OUTPUT.equalsByCode(e) ||
                    (e.isError() && !sys.equalToken(label, "error"))) {
                throw e;
            }

            // caught and continue execution past catch statement
        }
    }

    async function primitiveFor(forCtrlComp, bodyComp) {
        let srcmap = logo.env.getPrimitiveSrcmap();

        let forCtrlSrcmap = logo.type.getEmbeddedSrcmap(forCtrlComp);
        if (forCtrlSrcmap === logo.type.SRCMAP_NULL) {
            forCtrlSrcmap = srcmap;
        }

        if (logo.type.isLogoList(forCtrlComp)) {
            forCtrlComp = logo.parse.parseBlock(forCtrlComp);
        }

        let evxContext = logo.interpreter.makeEvalContext(forCtrlComp);
        let forVarName = evxContext.getToken();

        await evxForNextNumberExpr(evxContext, forCtrlComp, forCtrlSrcmap);

        let forBegin = sys.toNumberIfApplicable(evxContext.retVal);
        await evxForNextNumberExpr(evxContext, forCtrlComp, forCtrlSrcmap);

        let forEnd = sys.toNumberIfApplicable(evxContext.retVal);
        evxContext.retVal = undefined;
        if (evxContext.hasNext()) {
            await evxForNextNumberExpr(evxContext, forCtrlComp, forCtrlSrcmap);
        }

        let curScope = logo.env._scopeStack[logo.env._scopeStack.length - 1];
        let isDecrease = forEnd < forBegin;
        let forStep = !sys.isUndefined(evxContext.retVal) ? evxContext.retVal : isDecrease ? -1 : 1;

        for (curScope[forVarName] = forBegin;
            (!isDecrease && curScope[forVarName] <= forEnd) || (isDecrease && curScope[forVarName] >= forEnd);
            curScope[forVarName] += forStep) {
            await decorateSrcmap(async () => {
                let retVal = await logo.interpreter.evxInstrList(bodyComp, undefined, false);
                if (logo.config.get("unusedValue")) {
                    logo.env.checkUnusedValue(retVal, srcmap);
                }
            }, srcmap);
        }
    }

    async function evxForNextNumberExpr(evxContext, forCtrlComp, forCtrlSrcmap) {
        await logo.interpreter.evxNextNumberExpr(evxContext, logo.type.LogoException.INVALID_INPUT, ["for", forCtrlComp], forCtrlSrcmap);
    }

    async function decorateSrcmap(func, srcmap) {
        try {
            await func();
        } catch (e) {
            if (logo.type.LogoException.is(e)) {
                throw e.withParam(e.getValue(),
                    e.getSrcmap() === logo.type.SRCMAP_NULL || logo.env._curProc === undefined ? srcmap : e.getSrcmap());
            }

            throw e;
        }
    }

    function primitiveTime() {
        let date = new Date().toString().split(" "); // E.g. [Sat Sep 01 2018 14:53:26 GMT+1400 (LINT)]
        return logo.type.makeLogoList(date.slice(0, 3).concat(date[4], date[3]));
    }

    function primitiveTimeMilli() {
        return new Date().getTime();
    }

    function getBodyFromText(text) {
        let bodyText = logo.type.unboxList(logo.type.listButFirst(text));
        return logo.type.makeLogoList(logo.type.flattenList(bodyText, logo.type.NEWLINE));
    }

    function getBodySrcmapFromText(text) {
        let srcmap = logo.type.getEmbeddedSrcmap(text);
        if (srcmap === logo.type.SRCMAP_NULL) {
            return logo.type.SRCMAP_NULL;
        }

        let bodyTextSrcmap = logo.type.unboxList(logo.type.listButFirst(srcmap));
        return logo.type.makeLogoList(logo.type.flattenList(bodyTextSrcmap, logo.type.SRCMAP_NULL));
    }

    function getFormalFromText(text) {
        return logo.type.unboxList(logo.type.listFirst(text));
    }

    function getFormalSrcmapFromText(text) {
        let srcmap = logo.type.getEmbeddedSrcmap(text);
        if (srcmap === logo.type.SRCMAP_NULL) {
            return logo.type.SRCMAP_NULL;
        }

        return logo.type.unboxList(logo.type.listFirst(srcmap));
    }

    function primitiveDefine(procname, text) {
        logo.env.defineLogoProc(procname.toLowerCase(),
            getFormalFromText(text),
            getBodyFromText(text),
            getFormalSrcmapFromText(text),
            getBodySrcmapFromText(text));
    }

    function primitiveTo() {
        throw logo.type.LogoException.NESTED_TO.withParam([], logo.env.getPrimitiveSrcmap());
    }

    function primitiveText(procname) {
        return logo.env.getLogoProcText(procname.toLowerCase());
    }

    async function primitiveWait(delay) {
        logo.env.prepareToBeBlocked();
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 50 / 3 * delay);
        });

        return;
    }

    async function primitiveLoad(name) {
        let src = logo.logofs.get(name);
        await logo.entry.exec(src);
    }

    function primitiveIgnore(input) { // eslint-disable-line no-unused-vars
        // Does nothing
    }

    function primitiveHelp(topic) {
        try {
            logo.io.stdout(logo.logofs.get("/ucblogo/HELPFILE/" + topic.toLowerCase()));
        } catch (e) {
            if (logo.type.LogoException.is(e) && logo.type.LogoException.CANT_OPEN_FILE.equalsByCode(e)) {
                throw logo.type.LogoException.NO_HELP_AVAILABLE.withParam([topic], logo.env.getPrimitiveSrcmap());
            } else {
                throw e;
            }
        }
    }

    function dotUndefined() {
        return undefined;
    }

    async function primitiveDemo(name) {
        let option = undefined;
        if (logo.type.isLogoList(name)) {
            option = logo.type.listItem(2, name).toLowerCase();
            name = logo.type.listItem(1, name).toLowerCase();
        } else {
            name = name.toLowerCase();
        }

        let demoFileName = name + ".lgo";

        let src = logo.logofs.get("/demo/" + demoFileName);

        if (option !== undefined && option == "load") {
            logo.io.editorLoad(src);
        }

        await logo.entry.exec(src);
    }

    async function dotTest(testName, testMethod) {
        await logo.entry.runSingleTest(testName, testMethod);
    }

    let primitiveFormalString = {
        "local": "[args] 1",
        "show": "[args] 1",
        "print": "[args] 1",
        "pr": "[args] 1",
        "type": "[args] 1",

        "sentence": "[args] 2",
        "se": "[args] 2",
        "list": "[args] 2",
        "word": "[args] 2",
        "sum": "[args] 2",
        "and": "[args] 2",
        "or": "[args] 2",

        "listtoarray": "value [origin 1]",
        "mdarray": "sizeList [origin 1]",
        "throw": "tag [value .undefined]",
        "array": "size [origin 1]",

        "?": "[slotNum 1]",

        "foreach": "[inputs] 2",
        "invoke": "template [inputs] 2",

        "?rest": "[slotNum 1]"
    };

    let primitive = {
        "pi": primitivePi,

        "cleartext": primitiveCleartext,
        "ct": primitiveCleartext,

        " -": primitiveMinus,  // unary minus operator in ambiguous context

        "-": primitiveMinus,

        "minus": primitiveMinus,

        "sum": primitiveSum,

        "quotient": primitiveQuotient,

        "product": primitiveProduct,

        "remainder": primitiveRemainder,

        "sqrt": primitiveSqrt,

        "power": primitivePower,

        "log10": primitiveLog10,

        "sin": primitiveSin,

        "cos": primitiveCos,

        "round": primitiveRound,

        "int": primitiveInt,

        "abs": primitiveAbs,

        "sign": primitiveSign,

        "random": primitiveRandom,

        "iseq": primitiveIseq,

        "lessp": primitiveLessp,

        "lessequalp": primitiveLessequalp,

        "greaterp": primitiveGreaterp,

        "greaterequalp": primitiveGreaterequalp,

        "equalp": primitiveEqualp,
        "equal?": primitiveEqualp,

        "notequalp": primitiveNotequalp,
        "notequal?": primitiveNotequalp,

        "emptyp": primitiveEmptyp,
        "empty?": primitiveEmptyp,

        "wordp": primitiveWordp,
        "word?": primitiveWordp,

        "numberp": primitiveNumberp,
        "number?": primitiveNumberp,

        "listp": primitiveListp,
        "list?": primitiveListp,

        "arrayp": primitiveArrayp,
        "array?": primitiveArrayp,

        "memberp": primitiveMemberp,
        "member?": primitiveMemberp,

        "namep": primitiveNamep,
        "name?": primitiveNamep,

        "thing": primitiveThing,

        "show": primitiveShow,

        "print": primitivePrint,
        "pr": primitivePrint,

        "type": primitiveType,

        "make": primitiveMake,

        "local": primitiveLocal,

        "localmake": primitiveLocalmake,

        "item": primitiveItem,

        "mditem": primitiveMditem,

        "setitem": primitiveSetitem,

        "mdsetitem": primitiveMdsetitem,

        "word": primitiveWord,

        "list": primitiveList,

        "sentence": primitiveSentence,
        "se": primitiveSentence,

        "array": primitiveArray,

        "mdarray": primitiveMdarray,

        "listtoarray": primitiveListToArray,

        "arraytolist": primitiveArrayToList,

        "?": primitiveQuestionMark,

        "?rest": primitiveQuestionMarkRest,

        "#": primitiveHashMark,

        "ascii": primitiveAscii,

        "char": primitiveChar,

        "first": primitiveFirst,

        "last": primitiveLast,

        "butfirst": primitiveButfirst,
        "bf": primitiveButfirst,

        "butlast": primitiveButlast,
        "bl": primitiveButlast,

        "remove": primitiveRemove,

        "reverse": primitiveReverse,

        "count": primitiveCount,

        "fput": primitiveFput,

        "lput": primitiveLput,

        "and": primitiveAnd,

        "or": primitiveOr,

        "not": primitiveNot,

        "readword": primitiveReadword,

        "readlist": primitiveReadlist,

        "apply": primitiveApply,

        "invoke": primitiveInvoke,

        "foreach": primitiveForeach,

        "repeat": primitiveRepeat,

        "run": primitiveRun,

        "if": primitiveIf,

        "ifelse": primitiveIfelse,

        "catch": primitiveCatch,

        "for": primitiveFor,

        "time": primitiveTime,

        "timemilli": primitiveTimeMilli,

        "define": primitiveDefine,

        "to": primitiveTo,

        "text": primitiveText,

        "throw": primitiveThrow,

        "wait": primitiveWait,

        "load": primitiveLoad,

        "ignore": primitiveIgnore,

        "demo": primitiveDemo,

        "help": primitiveHelp,

        ".undefined": dotUndefined,

        ".test": dotTest
    };
    lrt.primitive = primitive;

    turtle.bindProcs(primitive, primitiveFormalString);

    lrt.getPrimitiveFormal = (function() {
        const primitiveFormal = {};
        return function getPrimitiveFormal(primitiveName) {
            if (!(primitiveName in primitiveFormal)) {
                if (primitiveName in primitiveFormalString) {
                    primitiveFormal[primitiveName] =
                        logo.env.captureFormalParams(logo.parse.parseSignature(primitiveFormalString[primitiveName]));
                } else {
                    sys.assert(primitiveName in primitive);
                    primitiveFormal[primitiveName] = logo.env.makeDefaultFormal(primitive[primitiveName].length);
                }
            }

            return primitiveFormal[primitiveName];
        };
    })();

    lrt.util = {};

    function getPrimitiveCallTarget(name) {
        return (name in lrt.primitive) ? lrt.primitive[name] : undefined;
    }
    lrt.util.getPrimitiveCallTarget = getPrimitiveCallTarget;

    function logoVar(v, varname, srcmap) {
        if (v === undefined) {
            throw logo.type.LogoException.VAR_HAS_NO_VALUE.withParam([varname], srcmap);
        }

        return v;
    }
    lrt.util.logoVar = logoVar;

    const unaryOperator = {
        " -" : 2, // unary minus operator in ambiguous context
        "-" : 2
    };

    function isUnaryOperator(op) {
        return op in unaryOperator;
    }
    lrt.util.isUnaryOperator = isUnaryOperator;

    function getPrimitivePrecedence(op) {
        return isUnaryOperator(op) ? unaryOperator[op] : 0;
    }
    lrt.util.getPrimitivePrecedence = getPrimitivePrecedence;

    const binaryOperator = {
        "+" :[2, primitiveSum],
        "-" :[2, primitiveDifference],
        "*" :[3, primitiveProduct],
        "/" :[3, primitiveQuotient],
        "==":[1, primitiveEqualp, "equalp"],
        "<>":[1, primitiveNotequalp, "notequalp"],
        ">=":[1, primitiveGreaterequalp],
        ">" :[1, primitiveGreaterp],
        "<=":[1, primitiveLessequalp],
        "<" :[1, primitiveLessp]
    };

    function isBinaryOperator(op) {
        return op in binaryOperator;
    }
    lrt.util.isBinaryOperator = isBinaryOperator;

    function isOnlyBinaryOperator(op) {
        return isBinaryOperator(op) && !isUnaryOperator(op);
    }
    lrt.util.isOnlyBinaryOperator = isOnlyBinaryOperator;

    function getBinaryOperatorPrecedence(op) {
        return binaryOperator[op][0];
    }
    lrt.util.getBinaryOperatorPrecedence = getBinaryOperatorPrecedence;

    function getBinaryOperatorRuntimeFunc(op) {
        return binaryOperator[op][1];
    }
    lrt.util.getBinaryOperatorRuntimeFunc = getBinaryOperatorRuntimeFunc;

    function getBinaryOperatorPrimitiveName(op) {
        return binaryOperator[op][2];
    }
    lrt.util.getBinaryOperatorPrimitiveName = getBinaryOperatorPrimitiveName;

    function getNamespaceObject(namespace) {
        if (namespace == "turtle") {
            return turtle;
        }
    }
    lrt.util.getNamespaceObject = getNamespaceObject;

    return lrt;
};

if (typeof exports != "undefined") {
    exports.$obj = $obj;
}
