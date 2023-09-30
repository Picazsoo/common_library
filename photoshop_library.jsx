//@include "./polyfill/array_foreach_polyfill.jsx"
//@include "./json.jsx"

//Common library of mine - updated 12/12/2021
function cTID(s) {
    return app.charIDToTypeID(s);
};

function sTID(s) {
    return app.stringIDToTypeID(s);
};

function findLayerByName(layerName) {
    //First try to find the layer among normal layers
    var layer = app.activeDocument.layers.getByName(layerName);
    if (layer == undefined || layer == null) {
        var layers = app.activeDocument.layers;
        for (var i = 0; i < layers.length; i++) {
            alert(layers[i]);
            if (layers[i] instanceof LayerSet) {
                alert("IS A SET");
                layer = layers[i].layers.getByName(layerName);
                if (layer != undefined && layer != null) {
                    alert("found within set");
                    break;
                }
            }
        }
        alert("NOT FOUND within set");
    }
    return layer;
}

function createNewDocument(filename, resW, resH, dpi) {
    var width = (resW / dpi) * 72;
    var height = (resH / dpi) * 72;
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putString(cTID('Nm  '), filename);
    desc2.putClass(cTID('Md  '), sTID("RGBColorMode"));
    desc2.putUnitDouble(cTID('Wdth'), cTID('#Rlt'), width);
    desc2.putUnitDouble(cTID('Hght'), cTID('#Rlt'), height);
    desc2.putUnitDouble(cTID('Rslt'), cTID('#Rsl'), dpi);
    desc2.putDouble(sTID("pixelScaleFactor"), 1);
    desc2.putEnumerated(cTID('Fl  '), cTID('Fl  '), cTID('Wht '));
    desc2.putInteger(cTID('Dpth'), 8);
    desc2.putString(sTID("profile"), "sRGB IEC61966-2.1");
    desc1.putObject(cTID('Nw  '), cTID('Dcmn'), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

function hideLayers(layerNames) {
    setVisibilityByLayersName(false, layerNames)
};

function showLayers(layerNames) {
    setVisibilityByLayersName(true, layerNames)
};

// Set
function selectAllPixels() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('Al  '));
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Cut
function cutSelected() {
    executeAction(cTID('cut '), undefined, DialogModes.NO);
};

// Paste
function pasteInPlace() {
    var desc1 = new ActionDescriptor();
    desc1.putBoolean(sTID("inPlace"), true);
    desc1.putEnumerated(cTID('AntA'), cTID('Annt'), cTID('Anno'));
    desc1.putClass(cTID('As  '), cTID('Pxel')); //was added in jan 2021
    executeAction(cTID('past'), desc1, DialogModes.NO);
};

function rgbColorFactory() {
    var color = new ActionDescriptor();
    if (arguments.length == 1) {
        // alert("single color");
        color.putDouble(cTID('Rd  '), arguments[0][0]);
        color.putDouble(cTID('Grn '), arguments[0][1]);
        color.putDouble(cTID('Bl  '), arguments[0][2]);
    } else {
        // alert("multi color " + arguments.length);
        color.putDouble(cTID('Rd  '), arguments[0]);
        color.putDouble(cTID('Grn '), arguments[1]);
        color.putDouble(cTID('Bl  '), arguments[2]);
        // alert("done color");
    }
    // alert("multfdsfi color");
    return color;
}
function close() {
    executeAction(cTID('Cls '), undefined, DialogModes.NO);
};

// Fill
function fillWithRGBColor(rgbColor) {
    var desc1 = new ActionDescriptor();
    desc1.putObject(cTID('Clr '), sTID("RGBColor"), rgbColor);
    desc1.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    desc1.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc1.putEnumerated(cTID('Usng'), cTID('FlCn'), cTID('Clr '));
    executeAction(cTID('Fl  '), desc1, DialogModes.NO);
};


function parseXMPInfo(xmpString) {
    var stringToParse = xmpString.toString();
    var documentArray = new Array;
    documentArray = stringToParse.split("\r");
    return documentArray;
}

function setZoom(zoom) {
    cTID = function (s) {
        return app.charIDToTypeID(s);
    };
    var docRes = activeDocument.resolution;
    activeDocument.resizeImage(undefined, undefined, 72 / (zoom / 100), ResampleMethod.NONE);
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putEnumerated(cTID("Mn  "), cTID("MnIt"), cTID('PrnS'));
    desc.putReference(cTID("null"), ref);
    executeAction(cTID("slct"), desc, DialogModes.NO);
    activeDocument.resizeImage(undefined, undefined, docRes, ResampleMethod.NONE);
}

// Canvas Size
function setCanvasSize(Height) {
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('Hght'), cTID('#Pxl'), Height);
    desc1.putEnumerated(cTID('Vrtc'), cTID('VrtL'), cTID('Cntr'));
    desc1.putEnumerated(sTID("canvasExtensionColorType"), sTID("canvasExtensionColorType"), cTID('BckC'));
    executeAction(sTID('canvasSize'), desc1, DialogModes.NO);
};

// Layer Via Copy
function copyLayer(sourceLayer, targetLayerName) {
    if (sourceLayer != undefined || sourceLayer != null) {
        selectLayers(sourceLayer);
    }
    executeAction(sTID('copyToLayer'), undefined, DialogModes.NO);
    if (targetLayerName != undefined || sourceLayer != null) {
        renameLayerFromTo(null, targetLayerName);
    }
};

// Desaturate
function desaturate() {
    executeAction(cTID('Dstt'), undefined, DialogModes.NO);
};

// Color Range
function colorRange(range) {
    var desc1 = new ActionDescriptor();
    desc1.putInteger(cTID('Fzns'), range.fuzziness);
    var desc2 = new ActionDescriptor();
    desc2.putDouble(cTID('Lmnc'), range.min.luminance);
    desc2.putDouble(cTID('A   '), range.min.a);
    desc2.putDouble(cTID('B   '), range.min.b);
    desc1.putObject(cTID('Mnm '), cTID('LbCl'), desc2);
    var desc3 = new ActionDescriptor();
    desc3.putDouble(cTID('Lmnc'), range.max.luminance);
    desc3.putDouble(cTID('A   '), range.max.a);
    desc3.putDouble(cTID('B   '), range.max.b);
    desc1.putObject(cTID('Mxm '), cTID('LbCl'), desc3);
    desc1.putInteger(sTID("colorModel"), 0);
    executeAction(sTID('colorRange'), desc1, DialogModes.NO);
};

//Color range within square bounds
function colorRangeWithinBounds(range, squareBounds) {
    deselectMarque();
    squareMarquee(squareBounds);
    colorRange(range);
}

// Make
function newLayer(layerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('Lyr '));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    if (layerName != undefined) {
        renameLayerFromTo(null, layerName);
    }
};

// Reset
function resetSwatches() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Clr '), cTID('Clrs'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Rset'), desc1, DialogModes.NO);
};



// Select
function selectLayers(layerNames) {
    if (layerNames instanceof Array) {
        layerNames.forEach(function (layerNameInArray, layerIndex) {
            var desc1 = new ActionDescriptor();
            var ref1 = new ActionReference();
            ref1.putName(cTID('Lyr '), layerNameInArray);
            desc1.putReference(cTID('null'), ref1);
            if (layerIndex > 0) {
                desc1.putEnumerated(sTID("selectionModifier"), sTID("selectionModifierType"), sTID("addToSelection"));
            }
            desc1.putBoolean(cTID('MkVs'), false);
            executeAction(cTID('slct'), desc1, DialogModes.NO);
        });
    } else {
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putName(cTID('Lyr '), layerNames);
        desc1.putReference(cTID('null'), ref1);
        desc1.putBoolean(cTID('MkVs'), false);
        executeAction(cTID('slct'), desc1, DialogModes.NO);
    }
};

// Select
function selectLayersFromTo(fromLayerName, toLayerName) {
    selectLayers(fromLayerName);
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(cTID('Lyr '), toLayerName);
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(sTID("selectionModifier"), sTID("selectionModifierType"), sTID("addToSelectionContinuous"));
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
};

// Make
function makeMask() {
    var desc1 = new ActionDescriptor();
    desc1.putClass(cTID('Nw  '), cTID('Chnl'));
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('At  '), ref1);
    desc1.putEnumerated(cTID('Usng'), cTID('UsrM'), cTID('RvlS'));
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

// Make
function makeEmptyMask() {
    var desc1 = new ActionDescriptor();
    desc1.putClass(cTID('Nw  '), cTID('Chnl'));
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Msk '));
    desc1.putReference(cTID('At  '), ref1);
    desc1.putEnumerated(cTID('Usng'), cTID('UsrM'), cTID('RvlA'));
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

// select channel
function selectCurrentChannelAsVisible(asVisible) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), asVisible);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  };

// Merge Layers
function mergeSelectedLayers() {
    var desc1 = new ActionDescriptor();
    executeAction(sTID('mergeLayersNew'), desc1, DialogModes.NO);
};

// Delete
function deleteSelectedPixels() {
    executeAction(cTID('Dlt '), undefined, DialogModes.NO);
};

// Prejmenuj vrstvu
function renameLayerFromTo(layerToRename, newLayerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    if (layerToRename != undefined || layerToRename != null) {
        ref1.putName(cTID('Lyr '), layerToRename);
    } else {
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    }
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putString(cTID('Nm  '), newLayerName);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Prejmenuj vybranou vrstvu
function renameCurrentLayerTo(newLayerName) {
    renameLayerFromTo(null, newLayerName);
};

// Refine Edge
function refineEdge(layerName) {
    //check if layer is visible and store the state
    var isVisible = findLayerByName(layerName).visible;
    if (!isVisible) {
        setVisibilityByLayerName(true, layerName);
    }
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(sTID("refineEdgeBorderRadius"), cTID('#Pxl'), 0);
    desc1.putUnitDouble(sTID("refineEdgeBorderContrast"), cTID('#Prc'), 100);
    desc1.putInteger(sTID("refineEdgeSmooth"), 0);
    desc1.putUnitDouble(sTID("refineEdgeFeatherRadius"), cTID('#Pxl'), 0);
    desc1.putUnitDouble(sTID("refineEdgeChoke"), cTID('#Prc'), -50);
    desc1.putBoolean(sTID("refineEdgeAutoRadius"), false);
    desc1.putBoolean(sTID("refineEdgeDecontaminate"), false);
    desc1.putEnumerated(sTID("refineEdgeOutput"), sTID("refineEdgeOutput"), sTID("selectionOutputToSelection"));
    executeAction(sTID('refineSelectionEdge'), desc1, DialogModes.NO);
    //restore visibility state
    if (!isVisible) {
        setVisibilityByLayerName(false, layerName);
    }
};

// lock /unlockSelected Layers 
function modifyLayersLock(setLock, layersToLock) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    if (layersToLock == undefined || layersToLock == null) {
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    } else if (layersToLock instanceof Array) {
        layersToLock.forEach(function (layerToLock) {
            ref1.putName(cTID('Lyr '), layerToLock);
        });
    } else {
        ref1.putName(cTID('Lyr '), layersToLock);
    }
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(sTID(setLock ? "protectAll" : "protectNone"), true);
    desc1.putObject(sTID("layerLocking"), sTID("layerLocking"), desc2);
    executeAction(sTID('applyLocking'), desc1, DialogModes.NO);
};


// Exchange
function switchSwatch() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Clr '), cTID('Clrs'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Exch'), desc1, DialogModes.NO);
};

// Move
function moveLayerTo(index) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putIndex(cTID('Lyr '), index);
    desc1.putReference(cTID('T   '), ref2);
    desc1.putBoolean(cTID('Adjs'), false);
    desc1.putInteger(cTID('Vrsn'), 5);
    executeAction(cTID('move'), desc1, DialogModes.NO);
};

// Move
function moveLayerTo2(layerName, index) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(cTID('Lyr '), layerName);
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putIndex(cTID('Lyr '), index);
    desc1.putReference(cTID('T   '), ref2);
    desc1.putBoolean(cTID('Adjs'), false);
    desc1.putInteger(cTID('Vrsn'), 5);
    executeAction(cTID('move'), desc1, DialogModes.NO);
};

function newLayerFromColorRange(range, newLayerName) {
    colorRange(range);
    copyLayer(null, newLayerName);
}

// Move
function moveLayerAboveLayer(layerToMove, placeAboveLayer) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(cTID('Lyr '), layerToMove);
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putName(cTID('Lyr '), placeAboveLayer);
    desc1.putReference(cTID('T   '), ref2);
    desc1.putBoolean(cTID('Adjs'), false);
    desc1.putInteger(cTID('Vrsn'), 5);
    executeAction(cTID('move'), desc1, DialogModes.NO);
};

// Create Clipping Mask
function createClippingMask() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(sTID('groupEvent'), desc1, DialogModes.NO);
};

function copySelection() {
    executeAction(cTID('copy'), undefined, DialogModes.NO);
};

// Show
function ShowLayer(setShowLayer) {
    var desc1 = new ActionDescriptor();
    var list1 = new ActionList();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    list1.putReference(ref1);
    desc1.putList(cTID('null'), list1);
    executeAction(cTID(setShowLayer ? 'Shw ' : 'Hd  '), desc1, DialogModes.NO);
};

// Hide
function setVisibilityByLayersName(setVisible, layerNames) {
    if (layerNames instanceof Array) {
        layerNames.forEach(function (layerName) {
            setVisibilityByLayerName(setVisible, layerName);
        });
    } else {
        setVisibilityByLayerName(setVisible, layerNames);
    }
};

// Hide
function setVisibilityByLayerName(setVisible, layerName) {
    var desc1 = new ActionDescriptor();
    var list1 = new ActionList();
    var ref1 = new ActionReference();
    ref1.putName(cTID('Lyr '), layerName);
    list1.putReference(ref1);
    desc1.putList(cTID('null'), list1);
    executeAction(cTID(setVisible ? 'Shw ' : 'Hd  '), desc1, DialogModes.NO);
};

// Hue/Saturation
function hueSaturationLightness(hue, saturation, lightness) {

    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(sTID("presetKind"), sTID("presetKindType"), sTID("presetKindCustom"));
    desc1.putBoolean(cTID('Clrz'), false);
    var list1 = new ActionList();
    var desc2 = new ActionDescriptor();
    desc2.putInteger(cTID('H   '), hue);
    desc2.putInteger(cTID('Strt'), saturation);
    desc2.putInteger(cTID('Lght'), lightness);
    list1.putObject(cTID('Hst2'), desc2);
    desc1.putList(cTID('Adjs'), list1);
    executeAction(sTID('hueSaturation'), desc1, DialogModes.NO);
};

// Set
function LayerBlendStyle() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Gry '));
    desc3.putReference(cTID('Chnl'), ref2);
    desc3.putInteger(cTID('SrcB'), 0);
    desc3.putInteger(cTID('Srcl'), 0);
    desc3.putInteger(cTID('SrcW'), 0);
    desc3.putInteger(cTID('Srcm'), 95);
    desc3.putInteger(cTID('DstB'), 0);
    desc3.putInteger(cTID('Dstl'), 0);
    desc3.putInteger(cTID('DstW'), 255);
    desc3.putInteger(cTID('Dstt'), 255);
    list1.putObject(cTID('Blnd'), desc3);
    desc2.putList(cTID('Blnd'), list1);
    var desc4 = new ActionDescriptor();
    desc4.putUnitDouble(cTID('Scl '), cTID('#Prc'), 416.666666666667);
    desc2.putObject(cTID('Lefx'), cTID('Lefx'), desc4);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Select All Layers
function SelectAllLayers() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(sTID('selectAllLayers'), desc1, DialogModes.NO);
};

// Make
function makeGroupFromSelection(groupName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("layerSection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('From'), ref2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
    renameCurrentLayerTo(groupName);
};

// Make
function makeGroupFromLayers(groupName, layers) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("layerSection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('From'), ref2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};


// Set selection to square of choice
function squareMarquee(marqueeCoordinates) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    var topPxl, leftPxl, btomPxl, rghtPxl;
    if (marqueeCoordinates instanceof Array) {
        leftPxl = marqueeCoordinates[0];
        topPxl = marqueeCoordinates[1];
        rghtPxl = marqueeCoordinates[2];
        btomPxl = marqueeCoordinates[3];
    } else if (marqueeCoordinates instanceof Object) {
        leftPxl = marqueeCoordinates.left;
        topPxl = marqueeCoordinates.top;
        rghtPxl = marqueeCoordinates.right;
        btomPxl = marqueeCoordinates.bottom;
    }
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Top '), cTID('#Pxl'), topPxl);
    desc2.putUnitDouble(cTID('Left'), cTID('#Pxl'), leftPxl);
    desc2.putUnitDouble(cTID('Btom'), cTID('#Pxl'), btomPxl);
    desc2.putUnitDouble(cTID('Rght'), cTID('#Pxl'), rghtPxl);
    desc1.putObject(cTID('T   '), cTID('Rctn'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Smazat vrstu
function deleteLayer(layerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    if (layerName == undefined || layerName == null) {
        ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    } else {
        ref1.putName(cTID('Lyr '), layerName);
    }
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Dlt '), desc1, DialogModes.NO);
};

// Set marque by transparency
function setMarqueByTransparency(layerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putEnumerated(cTID('Chnl'), cTID('Chnl'), cTID('Trsp'));
    if (layerName != undefined) {
        ref2.putName(cTID('Lyr '), layerName);
    }
    desc1.putReference(cTID('T   '), ref2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Deselect marque
function deselectMarque() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Chnl'), sTID("selection"));
    desc1.putReference(cTID('null'), ref1);
    desc1.putEnumerated(cTID('T   '), cTID('Ordn'), cTID('None'));
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

function rotateAroundPoint(_angle, x, y) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc1.putReference(charIDToTypeID('null'), ref1);
    desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSIndependent"));
    desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), x);
    desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), y);
    desc1.putObject(charIDToTypeID('Pstn'), charIDToTypeID('Pnt '), desc2);
    desc1.putUnitDouble(charIDToTypeID('Angl'), charIDToTypeID('#Ang'), _angle);
    desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID('Bcbc'));
    executeAction(charIDToTypeID('Trnf'), desc1, DialogModes.NO);
}

function rotateInDegrees(degrees) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Frst'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putUnitDouble(cTID('Angl'), cTID('#Ang'), degrees);
    executeAction(cTID('Rtte'), desc1, DialogModes.NO);
};

//Creates layer comp that allows to quicky toggle between layer arrangements
function createLayerComp(compName, comment) {

    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("compsClass"));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putBoolean(sTID("useVisibility"), true);
    desc2.putBoolean(sTID("usePosition"), true);
    desc2.putBoolean(sTID("useAppearance"), true);
    desc2.putBoolean(sTID("useChildLayerCompState"), false);
    if(compName.name != null) {
        desc2.putString(cTID('Ttl '), compName.name);
        desc2.putString(sTID("comment"), compName.desc);
    } else {
        desc2.putString(cTID('Ttl '), compName);
        desc2.putString(sTID("comment"), comment);
    }
    desc1.putObject(cTID('Usng'), sTID("compsClass"), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

function applyLayerComp(compName) {
    var layerComp = app.activeDocument.layerComps.getByName(compName);
    if (layerComp) {
        layerComp.apply();
    } else {
        alert("this layer comp does not exist!");
    }
};

function horizontallyTransformAroundPoint(_hortrans, x, y) {
    var x, y, _hortrans;
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var desc3 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc1.putReference(charIDToTypeID('null'), ref1);
    desc1.putEnumerated(charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), stringIDToTypeID("QCSIndependent"));
    desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), x);
    desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), y);
    desc1.putObject(charIDToTypeID('Pstn'), charIDToTypeID('Pnt '), desc2);
    desc3.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0);
    desc3.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0);
    desc1.putObject(charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc3);
    desc1.putUnitDouble(charIDToTypeID('Wdth'), charIDToTypeID('#Prc'), _hortrans);
    desc1.putEnumerated(charIDToTypeID('Intr'), charIDToTypeID('Intp'), charIDToTypeID('Bcbc'));
    executeAction(charIDToTypeID('Trnf'), desc1, DialogModes.NO);
}

function WriteGuides(guidesTXT) { //  "~/Desktop/temp_stinovac-guides.txt"
    var guidesAry = [];
    var numberOfGuides = app.activeDocument.guides.length;
    for (i = 0; i < numberOfGuides; i++) {
        guidesAry.push(app.activeDocument.guides[i].direction + ", " + app.activeDocument.guides[i].coordinate);
    };

    var myFile = guidesTXT;
    var textFile = new File(guidesTXT);
    textFile.open('w');
    for (a = 0; a < guidesAry.length; a++) {
        textFile.writeln(guidesAry[a]);
    }
    textFile.close();
}

function CreateGuides(guidesTXT) { //   "~/Desktop/temp_stinovac-guides.txt"
    var desktopPath = guidesTXT;
    var txtFile = new File(desktopPath);
    var guideAry = [];
    if (txtFile.open("r")) {
        while (!txtFile.eof) {
            guideAry.push(txtFile.readln());
        }
        txtFile.close();
        for (i = 0; i < guideAry.length; i++) {
            parameters = guideAry[i].split(", ");
            parameters[1] = parameters[1].replace(" px", "");
            if (parameters[0] == "Direction.HORIZONTAL") {
                addHorizontalRuler(parameters[1]);
            } else if (parameters[0] == "Direction.VERTICAL") {
                addVerticalRuler(parameters[1])
            }
        }
    }
}

function moveLayerPixels(xPixels, yPixels) {
    var xPixels, yPixels;
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(charIDToTypeID('Lyr '), charIDToTypeID('Ordn'), charIDToTypeID('Trgt'));
    desc1.putReference(charIDToTypeID('null'), ref1);
    desc2.putUnitDouble(charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), xPixels);
    desc2.putUnitDouble(charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), yPixels);
    desc1.putObject(charIDToTypeID('T   '), charIDToTypeID('Ofst'), desc2);
    executeAction(charIDToTypeID('move'), desc1, DialogModes.NO);
};
//Vloz pravitko horizontalni
function addHorizontalRuler(yPixels) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Pstn'), cTID('#Pxl'), yPixels);
    desc2.putEnumerated(cTID('Ornt'), cTID('Ornt'), cTID('Hrzn'));
    desc1.putObject(cTID('Nw  '), cTID('Gd  '), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

//Vloz pravitko vertikalni
function addVerticalRuler(xPixels) {
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Pstn'), cTID('#Pxl'), xPixels);
    desc2.putEnumerated(cTID('Ornt'), cTID('Ornt'), cTID('Vrtc'));
    desc1.putObject(cTID('Nw  '), cTID('Gd  '), desc2);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

function clockwiseToLandscape() {
    if (app.activeDocument.width.as("px") < app.activeDocument.height.as("px")) {
        rotateInDegrees(90);
    }
}

function expandMarquee(pixelsDistance, atCanvasBounds) {
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('By  '), cTID('#Pxl'), pixelsDistance);
    desc1.putBoolean(sTID("selectionModifyEffectAtCanvasBounds"), atCanvasBounds);
    executeAction(cTID('Expn'), desc1, DialogModes.NO);
};
// Obkresli diru
function strokeAroundMarquee(pixelWidth, rgbColor) {
    var desc1 = new ActionDescriptor();
    desc1.putInteger(cTID('Wdth'), pixelWidth);
    desc1.putEnumerated(cTID('Lctn'), cTID('StrL'), cTID('Otsd'));
    desc1.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    desc1.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc1.putObject(cTID('Clr '), sTID("RGBColor"), rgbColor);
    executeAction(cTID('Strk'), desc1, DialogModes.NO);
};
//Pridej komentar
function JachAddFileComment(komentarString) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('FlIn'));
    ref1.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    var list1 = new ActionList();
    list1.putString(komentarString);
    desc2.putList(cTID('Kywd'), list1);
    desc1.putObject(cTID('T   '), cTID('FlIn'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Crop to 3507*2480
function JachCrop() {
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('Wdth'), cTID('#Pxl'), 3507);
    desc1.putUnitDouble(cTID('Hght'), cTID('#Pxl'), 2480);
    desc1.putEnumerated(cTID('Hrzn'), cTID('HrzL'), cTID('Cntr'));
    desc1.putEnumerated(cTID('Vrtc'), cTID('VrtL'), cTID('Top '));
    executeAction(sTID('canvasSize'), desc1, DialogModes.NO);
};

// Nastav barvu popředí
function setFGColor(Red, Green, Blue) { //např. 0, 241, 192
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Clr '), cTID('FrgC'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putDouble(cTID('Rd  '), Red);
    desc2.putDouble(cTID('Grn '), Green);
    desc2.putDouble(cTID('Bl  '), Blue);
    desc1.putObject(cTID('T   '), sTID("RGBColor"), desc2);
    desc1.putString(cTID('Srce'), "eyeDropperSample");
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Vyber tužku
function SelectPencil(enabled, withDialog) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('PcTl'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
};

// Nastav Rozměr štětce
function SetBrushDiameter(diameterInPixels) { //např. 27
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Brsh'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(sTID("masterDiameter"), cTID('#Pxl'), diameterInPixels);
    desc1.putObject(cTID('T   '), cTID('Brsh'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

function SelectAllLayersBesidesBackground() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(sTID('selectAllLayers'), desc1, DialogModes.NO);
};

function FlattenImage() {
    executeAction(sTID('flattenImage'), undefined, DialogModes.NO);
};

function eSTINBlending() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Opct'), cTID('#Prc'), 60);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Scl '), cTID('#Prc'), 416.666666666667);
    var desc4 = new ActionDescriptor();
    desc4.putBoolean(cTID('enab'), true);
    desc4.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc4.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    var desc5 = new ActionDescriptor();
    desc5.putDouble(cTID('Rd  '), 255);
    desc5.putDouble(cTID('Grn '), 0);
    desc5.putDouble(cTID('Bl  '), 0);
    desc4.putObject(cTID('Clr '), sTID("RGBColor"), desc5);
    desc3.putObject(cTID('SoFi'), cTID('SoFi'), desc4);
    desc2.putObject(cTID('Lefx'), cTID('Lefx'), desc3);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

function eLIGHTBlending() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Opct'), cTID('#Prc'), 80);
    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble(cTID('Scl '), cTID('#Prc'), 416.666666666667);
    var desc4 = new ActionDescriptor();
    desc4.putBoolean(cTID('enab'), true);
    desc4.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc4.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    var desc5 = new ActionDescriptor();
    desc5.putDouble(cTID('Rd  '), 11.9844353199005);
    desc5.putDouble(cTID('Grn '), 0);
    desc5.putDouble(cTID('Bl  '), 255);
    desc4.putObject(cTID('Clr '), sTID("RGBColor"), desc5);
    desc3.putObject(cTID('SoFi'), cTID('SoFi'), desc4);
    desc2.putObject(cTID('Lefx'), cTID('Lefx'), desc3);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

function ClearStyles() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(sTID('disableLayerStyle'), desc1, DialogModes.NO);
};

function CreateGroup() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(sTID("layerSection"));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Mk  '), desc1, DialogModes.NO);
};

function opacityToPercent(percentage, layerName) { //such as 40
    //check if layer is visible and store the state
    var isVisible = findLayerByName(layerName).visible;
    if (!isVisible) {
        setVisibilityByLayerName(true, layerName);
    }
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(cTID('Lyr '), layerName);
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Opct'), cTID('#Prc'), percentage);
    desc1.putObject(cTID('T   '), cTID('Lyr '), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    //restore visibility state
    if (!isVisible) {
        setVisibilityByLayerName(false, layerName);
    }
};

function SelectRGBChannels() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Chnl'), cTID('Chnl'), sTID("RGB"));
    desc1.putReference(cTID('null'), ref1);
    desc1.putBoolean(cTID('MkVs'), false);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
};

//resize to width and keep aspect ratio
function resizeToWidth(widthInPixels) {
    var desc1 = new ActionDescriptor();
    desc1.putUnitDouble(cTID('Wdth'), cTID('#Pxl'), widthInPixels);
    desc1.putBoolean(sTID("scaleStyles"), true);
    desc1.putBoolean(cTID('CnsP'), true);
    desc1.putEnumerated(cTID('Intr'), cTID('Intp'), sTID("automaticInterpolation"));
    executeAction(sTID('imageSize'), desc1, DialogModes.NO);
};

function PlacePSD(fileNameAndPath) { //such as "/e/90/90_ae/FAZE/01_FAZE_002.psd"
    var desc1 = new ActionDescriptor();
    desc1.putPath(cTID('null'), new File(fileNameAndPath));
    desc1.putBoolean(cTID('Lnkd'), true);
    desc1.putEnumerated(cTID('FTcs'), cTID('QCSt'), sTID("QCSAverage"));
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Hrzn'), cTID('#Pxl'), 0);
    desc2.putUnitDouble(cTID('Vrtc'), cTID('#Pxl'), 0);
    desc1.putObject(cTID('Ofst'), cTID('Ofst'), desc2);
    executeAction(cTID('Plc '), desc1, DialogModes.NO);
};

function DuplicateLayerIntoDocument(layer, targetDocument) { //such as ("eSTIN",hele.psd); Places above currently selected layer
    var ref1 = new ActionReference();
    var desc1 = new ActionDescriptor();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    var ref2 = new ActionReference();
    ref2.putName(cTID('Dcmn'), targetDocument);
    desc1.putReference(cTID('T   '), ref2);
    desc1.putString(cTID('Nm  '), layer);
    desc1.putInteger(cTID('Vrsn'), 5);
    executeAction(cTID('Dplc'), desc1, DialogModes.NO);
};

// Set
function setColorOverlay(rgbColor, opacity, layerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('Lefx'));
    ref1.putName(cTID('Lyr '), layerName);
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Scl '), cTID('#Prc'), 416.666666666667);
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(cTID('enab'), true);
    desc3.putBoolean(sTID("present"), true);
    desc3.putBoolean(sTID("showInDialog"), true);
    desc3.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), rgbColor);
    desc3.putUnitDouble(cTID('Opct'), cTID('#Prc'), opacity);
    desc2.putObject(cTID('SoFi'), cTID('SoFi'), desc3);
    desc1.putObject(cTID('T   '), cTID('Lefx'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
    if (arguments.length > 3) {
        for (var i = 3; i < arguments.length; i++) {
            setColorOverlay(rgbColor, opacity, arguments[i]);
        }
    }
};

function invertMarquee() {
    executeAction(cTID('Invs'), undefined, DialogModes.NO);
};

// Set
function createOutlineForDespecle(rgbColor, layerName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('Lefx'));
    ref1.putName(cTID('Lyr '), layerName);
    desc1.putReference(cTID('null'), ref1);
    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble(cTID('Scl '), cTID('#Prc'), 416.666666666667);
    var desc3 = new ActionDescriptor();
    desc3.putBoolean(cTID('enab'), true);
    desc3.putBoolean(sTID("present"), true);
    desc3.putBoolean(sTID("showInDialog"), true);
    desc3.putEnumerated(cTID('Styl'), cTID('FStl'), cTID('OutF'));
    desc3.putEnumerated(cTID('PntT'), cTID('FrFl'), cTID('SClr'));
    desc3.putEnumerated(cTID('Md  '), cTID('BlnM'), cTID('Nrml'));
    desc3.putUnitDouble(cTID('Opct'), cTID('#Prc'), 100);
    desc3.putUnitDouble(cTID('Sz  '), cTID('#Pxl'), 6);
    desc3.putObject(cTID('Clr '), sTID("RGBColor"), rgbColor);
    desc3.putBoolean(sTID("overprint"), false);
    desc2.putObject(cTID('FrFX'), cTID('FrFX'), desc3);
    desc1.putObject(cTID('T   '), cTID('Lefx'), desc2);
    executeAction(cTID('setd'), desc1, DialogModes.NO);
};

// Hide
function hideOutlineForDespecle(layerName) {
    var desc1 = new ActionDescriptor();
    var list1 = new ActionList();
    var ref1 = new ActionReference();
    ref1.putIndex(cTID('FrFX'), 1);
    ref1.putName(cTID('Lyr '), layerName);
    list1.putReference(ref1);
    desc1.putList(cTID('null'), list1);
    executeAction(cTID('Hd  '), desc1, DialogModes.NO);
};

//aplikuje layer comp na smart object podle jména. když nenajde, tak neudělá nic.
function setSmartObjLayerCompByName(layerCompName) {

    var theCompsList = [];
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var layerDesc = executeActionGet(ref);
    if (layerDesc.hasKey(stringIDToTypeID("smartObject")) == true) {
        var smartObject = layerDesc.getObjectValue(stringIDToTypeID("smartObject"));
        theCompsList = smartObject.getObjectValue(stringIDToTypeID("compsList"));
        if (theCompsList.count > 2) {
            theCompsList = theCompsList.getList(stringIDToTypeID("compList"));
            var theSOComps = {};
            for (var m = 0; m < theCompsList.count; m++) {
                var current = theCompsList.getObjectValue(m);
                var theName = current.getString(stringIDToTypeID("name"));
                var theID = current.getInteger(stringIDToTypeID("ID"));
                var theComment = current.getString(stringIDToTypeID("comment"));
                theSOComps[theName] = theID;
            };
        };
        //its a little dirty to use the name as object attr key - but it works for now.
        if (theSOComps[layerCompName]) {
            setSmartObjLayerCompById(theSOComps[layerCompName]);
        }
        return;
    };
}

function replaceSmartObjContents(filePath) {
    alert("see selected layer");
    alert("replacing with " + filePath);
    var desc1 = new ActionDescriptor();
    desc1.putPath(cTID('null'), new File(filePath));
    executeAction(sTID('placedLayerReplaceContents'), desc1, DialogModes.NO);
};

function getNameOfLayerStartingWith(startOfString) {
    var layers = app.activeDocument.layers;
    var numOfLayers = layers.length;
    for (var i = 0; i < numOfLayers; i++) {
        var name = layers[i].name;
        if (name.indexOf(startOfString) != -1) {
            return name
        }
    }
    return undefined;
};



//selects layer starting with the string and returns true if it manages to select it.
function selectLayerStartingWith(startOfString) {
    //alert("trying to select layer " + startOfString);
    var layerName = getNameOfLayerStartingWith(startOfString);
    if (layerName) {
        //alert("found layer name " + layerName);
        selectLayers(layerName);
        return true;
    }
    //alert("no layer starting with " + startOfString + " found");
    return false;
};

function setSmartObjLayerCompById(layerCompId) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putEnumerated(cTID('Lyr '), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    desc1.putInteger(sTID("compID"), layerCompId);
    executeAction(sTID('setPlacedLayerComp'), desc1, DialogModes.NO);
};

  // Select Eraser
  function selectEraser() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(cTID('ErTl'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('slct'), desc1, DialogModes.NO);
  };

//Clears history for document
function clearhistoryForCurrDocumentNondestructive() {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(cTID('Prpr'), cTID('HsSt'));
    ref1.putEnumerated(cTID('Dcmn'), cTID('Ordn'), cTID('Trgt'));
    desc1.putReference(cTID('null'), ref1);
    executeAction(cTID('Cler'), desc1, DialogModes.NO);
};

function purgeAllHistory() {
    app.purge(PurgeTarget.HISTORYCACHES);
}

function purgeClipboard() {
    var desc1 = new ActionDescriptor();
    desc1.putEnumerated(cTID('null'), cTID('PrgI'), cTID('Clpb'));
    executeAction(cTID('Prge'), desc1, DialogModes.NO);
}

function checkIfAnyPalleteIsVisible() {
    var isVisible = false;
    var palletesToCheck = ["Nástroje", "Vrstvy", "Vzorník", "Color", "Informace", "Kanály", "Akce", "Knihovny", "Cesty", "Stopa", "Tools", "Layers", "Swatches", "Color", "Info", "Channels", "Actions", "Libraries", "Paths", "Brush"]
    var ref = new ActionReference();
    ref.putEnumerated(charIDToTypeID("capp"), charIDToTypeID("Ordn"), charIDToTypeID("Trgt"));
    var applicationDesc = executeActionGet(ref);
    var panelList = applicationDesc.getList(stringIDToTypeID('panelList'));
    for (var m = 0; m < panelList.count; m++) {
        var thisPanelDesc = panelList.getObjectValue(m);
        for (i = 0; i < palletesToCheck.length; i++) {
            if (thisPanelDesc.getString(stringIDToTypeID("name")) == palletesToCheck[i] && isVisible == false) {
                //alert(thisPanelDesc.getString(stringIDToTypeID("name")) + " je " + thisPanelDesc.getBoolean(stringIDToTypeID("visible")));
                isVisible = thisPanelDesc.getBoolean(stringIDToTypeID("visible"));
            }
        }
    }
    return isVisible;
};

function hidePalettes() {
    setShowPalettes(false);
}

function showPalettes() {
    setShowPalettes(true);
}

function setShowPalettes(showBoolean) {
    if (showBoolean) {
        if (!checkIfAnyPalleteIsVisible()) {
            app.togglePalettes();
        }
    } else {
        if (checkIfAnyPalleteIsVisible()) {
            app.togglePalettes();
        }
    }
}

function getFilesFromBridge() {
    var fileList;
    if (BridgeTalk.isRunning("bridge")) {
        var bt = new BridgeTalk();
        bt.target = "bridge";
        bt.body = "var theFiles = photoshop.getBridgeFileListForAutomateCommand();theFiles.toSource();";
        bt.onResult = function (inBT) {
            fileList = eval(inBT.body);
        }
        bt.onError = function (inBT) {
            fileList = new Array();
        }
        bt.send();
        bt.pump();
        $.sleep(100);
        var timeOutAt = (new Date()).getTime() + 5000;
        var currentTime = (new Date()).getTime();
        while ((currentTime < timeOutAt) && (undefined == fileList)) {
            bt.pump();
            $.sleep(100);
            currentTime = (new Date()).getTime();
        }
    }
    if (undefined == fileList) {
        fileList = new Array();
    }
    return fileList;
}
