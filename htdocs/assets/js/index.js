(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.project = window.project || {};

  window.isEnabledlog = true;

  window.log = (function() {
    if (window.isEnabledlog) {
      if ((window.console != null) && (window.console.log.bind != null)) {
        return window.console.log.bind(window.console);
      } else {
        return window.alert;
      }
    } else {
      return function() {};
    }
  })();

  window.requestAnimationFrame = ((function(_this) {
    return function() {
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
        return setTimeout(callback, 1000 / 60);
      };
    };
  })(this))();

  window.cancelAnimationFrame = ((function(_this) {
    return function() {
      return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame || window.oCancelAnimationFrame || function(id) {
        return clearTimeout(id);
      };
    };
  })(this))();

  project.Main = (function() {
    var _MAP_HALF_WIDTH, _MAP_HEIGHT, _MAP_OFFSET_X, _MAP_VIRTUAL_HEIGHT, _MAP_WIDTH, _POINT_ZERO;

    _POINT_ZERO = new THREE.Vector3();

    _MAP_WIDTH = 1280;

    _MAP_HALF_WIDTH = 640;

    _MAP_HEIGHT = 720;

    _MAP_VIRTUAL_HEIGHT = 930;

    _MAP_OFFSET_X = 40;

    function Main() {
      this.windowResizeHandler = bind(this.windowResizeHandler, this);
      this.update = bind(this.update, this);
      this.$window = $(window);
      this.$body = $('body');
      this.$canvas = $('canvas');
      this.canvasElm = this.$canvas.get(0);
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 10, 10000);
      this.camera.target = _POINT_ZERO;
      this.camera.position.z = 1000;
      this.camera.position.y = 500;
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvasElm,
        antialias: true,
        alpha: true
      });
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 2;
      this.controls.zoomSpeed = 0.4;
      this.container = new THREE.Object3D();
      this.scene.add(this.container);
      THREE.ImageUtils.loadTexture('assets/img/worldMap.png', THREE.UVMapping, (function(_this) {
        return function(texture) {
          _this.planeGeometry = new THREE.PlaneBufferGeometry(_MAP_WIDTH, _MAP_HEIGHT, 1, 1);
          _this.mapMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
          });
          texture.repeat.set(1, _MAP_HEIGHT / _MAP_VIRTUAL_HEIGHT);
          texture.offset.set(0, (_MAP_VIRTUAL_HEIGHT - _MAP_HEIGHT) / _MAP_VIRTUAL_HEIGHT);
          texture.minFilter = THREE.NearestFilter;
          _this.map = new THREE.Mesh(_this.planeGeometry, _this.mapMaterial);
          _this.map.rotation.x = -Math.PI / 2;
          _this.container.add(_this.map);
          _this.update();
          return _this.$window.on('resize', _this.windowResizeHandler).trigger('resize');
        };
      })(this));
      $.getJSON('assets/json/positions.json', (function(_this) {
        return function(json) {
          var balloon, data, j, len, posX, ref, results;
          _this.balloons = [];
          ref = json.data;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            data = ref[j];
            balloon = new project.Pin(data.country, data.capital);
            _this.container.add(balloon.container);
            posX = data.x - _MAP_OFFSET_X;
            if (posX < -_MAP_HALF_WIDTH) {
              posX += _MAP_HALF_WIDTH;
            }
            balloon.container.position.set(posX, 1, -data.y + (_MAP_VIRTUAL_HEIGHT - _MAP_HEIGHT) / 2);
            results.push(_this.balloons.push(balloon));
          }
          return results;
        };
      })(this));
    }

    Main.prototype.update = function() {
      var balloon, j, len, ref;
      ref = this.balloons;
      for (j = 0, len = ref.length; j < len; j++) {
        balloon = ref[j];
        balloon.update(this.camera, this.container);
      }
      this.camera.lookAt(this.camera.target);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      return requestAnimationFrame(this.update);
    };

    Main.prototype.windowResizeHandler = function(e) {
      var aspect, height, width;
      width = window.innerWidth;
      height = window.innerHeight;
      aspect = width / height;
      this.renderer.setSize(width, height);
      this.renderer.setViewport(0, 0, width, height);
      this.camera.aspect = aspect;
      return this.camera.updateProjectionMatrix();
    };

    return Main;

  })();

  project.Pin = (function() {
    var _AXIS_Y, _CAPITAL_FONT_SIZE, _COUNTRY_FONT_SIZE, _FONT, _FONT_COLOR, _TXT_PLANE_GEOMETRY_SIZE, _TXT_SCALE;

    _TXT_PLANE_GEOMETRY_SIZE = 100;

    _AXIS_Y = new THREE.Vector3(0, 1, 0);

    _TXT_SCALE = 0.2;

    _FONT = "'Note Serif', serif";

    _FONT_COLOR = '#76c100';

    _COUNTRY_FONT_SIZE = 20;

    _CAPITAL_FONT_SIZE = 40;

    Pin.triangleGeometry = null;

    Pin.txtPlaneGeometry = new THREE.PlaneBufferGeometry(_TXT_PLANE_GEOMETRY_SIZE, _TXT_PLANE_GEOMETRY_SIZE, 1, 1);

    Pin.triangleMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x76c100,
      side: THREE.DoubleSide,
      fog: true
    });

    function Pin(country, capital) {
      var capitalTxtHeight, capitalTxtSettings, capitalTxtTexture, capitalTxtWidth, capitalTxts, countryTxtHeight, countryTxtTexture, countryTxtWidth, ref, ref1, triangleGeometry;
      this.country = country;
      this.capital = capital;
      this.update = bind(this.update, this);
      this.container = new THREE.Object3D();
      triangleGeometry = project.Pin.getTriangleGeometry();
      this.triangle = new THREE.Mesh(triangleGeometry, project.Pin.triangleMaterial);
      this.container.add(this.triangle);
      ref = project.Pin.createTxtTexture([
        {
          txt: this.country,
          fontSize: _COUNTRY_FONT_SIZE,
          color: _FONT_COLOR,
          fontFamily: _FONT
        }
      ]), countryTxtTexture = ref[0], countryTxtWidth = ref[1], countryTxtHeight = ref[2];
      this.countryTxtPlane = project.Pin.createTxtPlane(countryTxtTexture, countryTxtWidth, countryTxtHeight);
      this.countryTxtPlane.scale.set(this.countryTxtPlane.scale.x * _TXT_SCALE, this.countryTxtPlane.scale.y * _TXT_SCALE, 1);
      this.countryTxtPlane.position.y = 7;
      this.container.add(this.countryTxtPlane);
      capitalTxts = this.capital.split(' (');
      capitalTxtSettings = [
        {
          txt: capitalTxts[0],
          fontSize: _CAPITAL_FONT_SIZE,
          color: _FONT_COLOR,
          fontFamily: _FONT
        }
      ];
      if (capitalTxts[1] != null) {
        capitalTxtSettings.push({
          txt: '(' + capitalTxts[1],
          fontSize: _CAPITAL_FONT_SIZE * 0.5,
          color: _FONT_COLOR,
          fontFamily: _FONT,
          offsetX: _CAPITAL_FONT_SIZE * 0.2,
          offsetY: _CAPITAL_FONT_SIZE * 0.25
        });
      }
      ref1 = project.Pin.createTxtTexture(capitalTxtSettings), capitalTxtTexture = ref1[0], capitalTxtWidth = ref1[1], capitalTxtHeight = ref1[2];
      this.capitalTxtPlane = project.Pin.createTxtPlane(capitalTxtTexture, capitalTxtWidth, capitalTxtHeight);
      this.capitalTxtPlane.scale.set(this.capitalTxtPlane.scale.x * _TXT_SCALE, this.capitalTxtPlane.scale.y * _TXT_SCALE, 1);
      this.capitalTxtPlane.position.y = 14;
      this.container.add(this.capitalTxtPlane);
      this.isVisible = false;
      this.countryTxtPlane.visible = false;
      this.capitalTxtPlane.visible = false;
    }

    Pin.prototype.update = function(camera, container) {
      var d, pos;
      this.container.quaternion.copy(camera.quaternion);
      pos = this.container.position.clone();
      pos.applyAxisAngle(_AXIS_Y, container.rotation.y);
      d = pos.distanceTo(camera.position);
      if (d < 200) {
        this.countryTxtPlane.visible = true;
        this.capitalTxtPlane.visible = true;
        if (!this.isVisible) {
          this.isVisible = true;
          TweenMax.killTweensOf(this.countryTxtPlane.material);
          TweenMax.killTweensOf(this.capitalTxtPlane.material);
          TweenMax.to(this.countryTxtPlane.material, 0.4, {
            opacity: 1
          });
          return TweenMax.to(this.capitalTxtPlane.material, 0.4, {
            opacity: 1
          });
        }
      } else {
        if (this.isVisible) {
          this.isVisible = false;
          TweenMax.killTweensOf(this.countryTxtPlane.material);
          TweenMax.killTweensOf(this.capitalTxtPlane.material);
          TweenMax.to(this.countryTxtPlane.material, 0.4, {
            opacity: 0
          });
          return TweenMax.to(this.capitalTxtPlane.material, 0.4, {
            opacity: 0,
            onComplete: (function(_this) {
              return function() {
                _this.countryTxtPlane.visible = false;
                return _this.capitalTxtPlane.visible = false;
              };
            })(this)
          });
        }
      }
    };

    Pin.createTriangleGeometry = function() {
      Pin.triangleGeometry = new THREE.Geometry;
      Pin.triangleGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
      Pin.triangleGeometry.vertices.push(new THREE.Vector3(2, 3, 0));
      Pin.triangleGeometry.vertices.push(new THREE.Vector3(-2, 3, 0));
      return Pin.triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));
    };

    Pin.getTriangleGeometry = function() {
      if (Pin.triangleGeometry != null) {
        return Pin.triangleGeometry;
      }
      Pin.createTriangleGeometry();
      return Pin.triangleGeometry;
    };

    Pin.createTxtTexture = function(txtSettings) {
      var canvas, context, i, j, k, len, len1, maxHeight, offsetY, pos, setContext, setting, texture, width;
      canvas = document.createElement('canvas');
      setContext = function(fontSize, fontFamily) {
        var context;
        context = canvas.getContext('2d');
        context.font = fontSize + "px " + fontFamily;
        return context;
      };
      width = 0;
      maxHeight = 0;
      pos = [];
      for (j = 0, len = txtSettings.length; j < len; j++) {
        setting = txtSettings[j];
        context = setContext(setting.fontSize, setting.fontFamily);
        offsetY = setting.offsetY != null ? setting.offsetY : 0;
        maxHeight = Math.max(maxHeight, setting.fontSize + offsetY);
        if (setting.offsetX != null) {
          width += setting.offsetX;
        }
        pos.push(width);
        width += context.measureText(setting.txt).width;
      }
      maxHeight *= 1.1;
      canvas.width = width;
      canvas.height = maxHeight;
      for (i = k = 0, len1 = txtSettings.length; k < len1; i = ++k) {
        setting = txtSettings[i];
        context = setContext(setting.fontSize, setting.fontFamily);
        context.fillStyle = setting.color;
        context.textBaseline = 'middle';
        context.imageSmoothingEnabled = true;
        offsetY = (setting.offsetY != null ? setting.offsetY / 2 : 0) + maxHeight / 2;
        context.fillText(setting.txt, pos[i], offsetY);
      }
      texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      texture.minFilter = THREE.LinearFilter;
      return [texture, width, canvas.height];
    };

    Pin.createTxtPlane = function(texture, width, height) {
      var material, mesh;
      material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide,
        fog: true
      });
      mesh = new THREE.Mesh(this.txtPlaneGeometry, material);
      mesh.scale.x = width / _TXT_PLANE_GEOMETRY_SIZE;
      mesh.scale.y = height / _TXT_PLANE_GEOMETRY_SIZE;
      return mesh;
    };

    return Pin;

  })();

  $(function() {
    return new project.Main();
  });

}).call(this);
