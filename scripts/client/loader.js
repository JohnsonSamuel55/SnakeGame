MyGame = {
    input: {},
    components: {},
    renderers: {},
    utilities: {},
    assets: {}
};

MyGame.loader = function() {
    'use strict';

    //Used to load scripts for the client
    let scriptOrder = [
        {
            scripts: ['../shared/network-ids'],
            message: 'Network Ids loaded',
            onComplete: null,
        }, {
            scripts: ['../shared/queue'],
            message: 'Utilities loaded',
            onComplete: null,
        }, {
            scripts: ['input'],
            message: 'Input loaded',
            onComplete: null
        }, {
            scripts: ['../shared/circle-types', '../shared/random', '../shared/turn-point', '../shared/directions'],
            message: 'Shared functionality loaded',
            onComplete: null
        }, {
            scripts: ['components/snake', 'components/circle', 'components/snake-remote', 'components/food', 'components/background'],
            message: 'Components loaded',
            onComplete: null
        }, {
            scripts: ['render/graphics', 'render/snake', 'render/animated-sprite', 'render/background'],
            message: 'Rendering loaded',
            onComplete: null
        }, {
            scripts: ['gameloop'],
            message: 'Gameplay model loaded',
            onComplete: null
        }],

        //Used to load assets for the client
        assetOrder = [{
            key: 'head',
            source: 'assets/textures/head.png'
        }, {
            key: 'body',
            source: 'assets/textures/body.png'
        }, {
            key: 'tail',
            source: 'assets/textures/tail.png'
        }, {
            key: 'food',
            source: 'assets/textures/food.png'
        }, {
            key: 'background',
            source: 'assets/textures/background.png'
        }];
    
    function loadScripts(scripts, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (scripts.length > 0) {
            let entry = scripts[0];
            require(entry.scripts, function() {
                console.log(entry.message);
                if (entry.onComplete) {
                    entry.onComplete();
                }
                scripts.splice(0, 1);
                loadScripts(scripts, onComplete);
            });
        } else {
            onComplete();
        }
    }
    
    function loadAssets(assets, onSuccess, onError, onComplete) {
        //
        // When we run out of things to load, that is when we call onComplete.
        if (assets.length > 0) {
            let entry = assets[0];
            loadAsset(entry.source,
                function(asset) {
                    onSuccess(entry, asset);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                },
                function(error) {
                    onError(error);
                    assets.splice(0, 1);
                    loadAssets(assets, onSuccess, onError, onComplete);
                });
        } else {
            onComplete();
        }
    }

    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
    	let xhr = new XMLHttpRequest(),
            asset = null,
            fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    asset.onload = function() {
                        window.URL.revokeObjectURL(asset.src);
                    };
                    asset.src = window.URL.createObjectURL(xhr.response);
                    if (onSuccess) { onSuccess(asset); }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }

        xhr.send();
    }
    
    function mainComplete() {
        console.log('it is all loaded up');
        MyGame.main.initialize();
    }

    // Start with loading the assets, then the scripts.
    console.log('Starting to dynamically load project assets');
    loadAssets(assetOrder,
        function(source, asset) {    // Store it on success
            MyGame.assets[source.key] = asset;
        },
        function(error) {
            console.log(error);
        },
        function() {
            console.log('All assets loaded');
            console.log('Starting to dynamically load project scripts');
            loadScripts(scriptOrder, mainComplete);
        }
    );

};
