window.project = window.project || {}

# console.log wrapper
window.isEnabledlog = true
window.log = (->
  if window.isEnabledlog
    if window.console? and window.console.log.bind?
      return window.console.log.bind window.console
    else
      return window.alert
  else ->
)()

# requestAnimationFrame wrapper
window.requestAnimationFrame = (=>
  return  window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          window.msRequestAnimationFrame ||
          window.oRequestAnimationFrame ||
          (callback)=> return setTimeout(callback, 1000 / 60)
)()

# cancelAnimationFrame wrapper
window.cancelAnimationFrame = (=>
  return  window.cancelAnimationFrame ||
          window.webkitCancelAnimationFrame ||
          window.mozCancelAnimationFrame ||
          window.msCancelAnimationFrame ||
          window.oCancelAnimationFrame ||
          (id)=> return clearTimeout(id)
)()

# ドキュメントクラス
class project.Main
  _POINT_ZERO = new THREE.Vector3()
  _MAP_WIDTH = 1280
  _MAP_HALF_WIDTH = 640
  _MAP_HEIGHT = 720
  _MAP_VIRTUAL_HEIGHT = 930
  _MAP_OFFSET_X = 40

  constructor: ->
    @$window = $　window
    @$body   = $ 'body'

    @$canvas = $ 'canvas'
    @canvasElm = @$canvas.get 0

    @scene = new THREE.Scene()
    @camera = new THREE.PerspectiveCamera 35, window.innerWidth / window.innerHeight, 10, 10000
    @camera.target = _POINT_ZERO
    @camera.position.z = 1000
    @camera.position.y = 500
    @renderer = new THREE.WebGLRenderer
      canvas: @canvasElm
      antialias: true
      alpha: true
    @renderer.setPixelRatio window.devicePixelRatio

    # control
    @controls = new THREE.TrackballControls @camera
    @controls.autoRotate = true
    @controls.autoRotateSpeed = 2
    @controls.zoomSpeed = 0.4

    @container = new THREE.Object3D()
    @scene.add @container

    # 世界地図のテクスチャをロード
    THREE.ImageUtils.loadTexture 'assets/img/worldMap.png', THREE.UVMapping, (texture)=>
      @planeGeometry = new THREE.PlaneBufferGeometry _MAP_WIDTH, _MAP_HEIGHT, 1, 1
      @mapMaterial = new THREE.MeshBasicMaterial map: texture, transparent: true, side: THREE.DoubleSide
      texture.repeat.set 1, _MAP_HEIGHT / _MAP_VIRTUAL_HEIGHT
      texture.offset.set 0, (_MAP_VIRTUAL_HEIGHT - _MAP_HEIGHT) / _MAP_VIRTUAL_HEIGHT
      texture.minFilter = THREE.NearestFilter
      @map = new THREE.Mesh @planeGeometry, @mapMaterial
      @map.rotation.x = -Math.PI / 2
      @container.add @map

      # アニメーション開始
      @update()

      # ウィンドウリサイズ
      @$window.on('resize', @windowResizeHandler).trigger 'resize'


    # 座標のデータ取得
    $.getJSON 'assets/json/positions.json', (json)=>
      @balloons = []
      for data in json.data
        balloon = new project.Pin data.country, data.capital
        @container.add balloon.container

        # データ生成時の地図画像と使用している地図画像の差異を吸収
        posX = data.x - _MAP_OFFSET_X
        if posX < -_MAP_HALF_WIDTH then posX += _MAP_HALF_WIDTH

        balloon.container.position.set posX, 1, -data.y + (_MAP_VIRTUAL_HEIGHT - _MAP_HEIGHT) / 2
        @balloons.push balloon



  # 描画更新
  update: =>
    for balloon in @balloons then balloon.update @camera, @container
    @camera.lookAt @camera.target
    @controls.update()
    @renderer.render @scene, @camera
    requestAnimationFrame @update


  # ウィンドウリサイズ
  windowResizeHandler: (e)=>
    width = window.innerWidth
    height = window.innerHeight
    aspect = width / height

    @renderer.setSize width, height
    @renderer.setViewport 0, 0, width, height
    @camera.aspect = aspect
    @camera.updateProjectionMatrix()




# 地図上の首都のピン
class project.Pin
  _TXT_PLANE_GEOMETRY_SIZE = 100
  _AXIS_Y = new THREE.Vector3 0, 1, 0
  _TXT_SCALE = 0.2

  _FONT = "'Note Serif', serif"
  _FONT_COLOR = '#76c100'
  _COUNTRY_FONT_SIZE = 20
  _CAPITAL_FONT_SIZE = 40

  @triangleGeometry: null # ピンの三角形のジオメトリ (すべてのインスタンスで共通のものを使用)
  @txtPlaneGeometry: new THREE.PlaneBufferGeometry _TXT_PLANE_GEOMETRY_SIZE, _TXT_PLANE_GEOMETRY_SIZE, 1, 1
  @triangleMaterial: new THREE.MeshBasicMaterial transparent: true, color: 0x76c100, side: THREE.DoubleSide, fog: true

  constructor: (@country, @capital)->
    @container = new THREE.Object3D()

    # 三角形
    triangleGeometry = project.Pin.getTriangleGeometry()
    @triangle = new THREE.Mesh triangleGeometry, project.Pin.triangleMaterial
    @container.add @triangle

    # 国名
    [ countryTxtTexture, countryTxtWidth, countryTxtHeight ] = project.Pin.createTxtTexture [
      txt: @country
      fontSize: _COUNTRY_FONT_SIZE
      color: _FONT_COLOR
      fontFamily: _FONT
    ]
    @countryTxtPlane = project.Pin.createTxtPlane countryTxtTexture, countryTxtWidth, countryTxtHeight
    @countryTxtPlane.scale.set @countryTxtPlane.scale.x * _TXT_SCALE, @countryTxtPlane.scale.y * _TXT_SCALE, 1
    @countryTxtPlane.position.y = 7
    @container.add @countryTxtPlane

    # 首都名
    # 首都名の補足としてカッコで囲まれたテキストがある場合は、分割する
    capitalTxts = @capital.split ' ('
    capitalTxtSettings = [
      txt: capitalTxts[0]
      fontSize: _CAPITAL_FONT_SIZE
      color: _FONT_COLOR
      fontFamily: _FONT
    ]
    if capitalTxts[1]?
      capitalTxtSettings.push
        txt: '(' + capitalTxts[1]
        fontSize: _CAPITAL_FONT_SIZE * 0.5
        color: _FONT_COLOR
        fontFamily: _FONT
        offsetX: _CAPITAL_FONT_SIZE * 0.2
        offsetY: _CAPITAL_FONT_SIZE * 0.25

    [ capitalTxtTexture, capitalTxtWidth, capitalTxtHeight ] = project.Pin.createTxtTexture capitalTxtSettings
    @capitalTxtPlane = project.Pin.createTxtPlane capitalTxtTexture, capitalTxtWidth, capitalTxtHeight
    @capitalTxtPlane.scale.set @capitalTxtPlane.scale.x * _TXT_SCALE, @capitalTxtPlane.scale.y * _TXT_SCALE, 1
    @capitalTxtPlane.position.y = 14
    @container.add @capitalTxtPlane

    # 初期状態では非表示
    @isVisible = false
    @countryTxtPlane.visible = false
    @capitalTxtPlane.visible = false


  # 更新
  update: (camera, container)=>
    @container.quaternion.copy camera.quaternion
    pos = @container.position.clone()
    pos.applyAxisAngle _AXIS_Y, container.rotation.y
    d = pos.distanceTo camera.position
    if d < 200
      @countryTxtPlane.visible = true
      @capitalTxtPlane.visible = true
      if !@isVisible
        @isVisible = true
        TweenMax.killTweensOf @countryTxtPlane.material
        TweenMax.killTweensOf @capitalTxtPlane.material

        TweenMax.to @countryTxtPlane.material, 0.4, { opacity: 1 }
        TweenMax.to @capitalTxtPlane.material, 0.4, { opacity: 1 }
    else
      if @isVisible
        @isVisible = false
        TweenMax.killTweensOf @countryTxtPlane.material
        TweenMax.killTweensOf @capitalTxtPlane.material

        TweenMax.to @countryTxtPlane.material, 0.4, { opacity: 0 }
        TweenMax.to @capitalTxtPlane.material, 0.4, { opacity: 0, onComplete: =>
          @countryTxtPlane.visible = false
          @capitalTxtPlane.visible = false
        }


  # 三角形のジオメトリを作成
  @createTriangleGeometry: =>
    # triangle for balloon
    @triangleGeometry = new THREE.Geometry
    @triangleGeometry.vertices.push new THREE.Vector3(0, 0, 0)
    @triangleGeometry.vertices.push new THREE.Vector3(2, 3, 0)
    @triangleGeometry.vertices.push new THREE.Vector3(-2, 3, 0)
    @triangleGeometry.faces.push new THREE.Face3(0, 1, 2)




  # 三角形のジオメトリを取得
  @getTriangleGeometry: =>
    if @triangleGeometry? then return @triangleGeometry
    @createTriangleGeometry()
    return @triangleGeometry


  # text用のマテリアルを生成 (static)
  @createTxtTexture = (txtSettings)=>
    canvas = document.createElement 'canvas'

    setContext = (fontSize, fontFamily)->
      context = canvas.getContext '2d'
      context.font = "#{fontSize}px #{fontFamily}"
      return context

    # calculate width
    width = 0
    maxHeight = 0
    pos = []
    for setting in txtSettings
      context = setContext setting.fontSize, setting.fontFamily
      offsetY = if setting.offsetY? then setting.offsetY else 0
      maxHeight = Math.max maxHeight, setting.fontSize + offsetY
      if setting.offsetX? then width += setting.offsetX
      pos.push width
      width += context.measureText(setting.txt).width

    maxHeight *= 1.1
    canvas.width = width
    canvas.height = maxHeight

    for setting, i in txtSettings
      context = setContext setting.fontSize, setting.fontFamily
      context.fillStyle = setting.color
      context.textBaseline = 'middle'
      context.imageSmoothingEnabled = true
      offsetY = (if setting.offsetY? then setting.offsetY / 2 else 0) + maxHeight / 2
      context.fillText setting.txt, pos[i], offsetY

    texture = new THREE.Texture canvas
    texture.needsUpdate = true
    texture.minFilter = THREE.LinearFilter

    return [ texture, width, canvas.height ]


  # テクスチャを使用してテキストのMeshを生成
  @createTxtPlane: (texture, width, height)->
    material = new THREE.MeshBasicMaterial map: texture, transparent: true, opacity: 1, side: THREE.DoubleSide, fog: true
    mesh = new THREE.Mesh @txtPlaneGeometry, material
    mesh.scale.x = width / _TXT_PLANE_GEOMETRY_SIZE
    mesh.scale.y = height / _TXT_PLANE_GEOMETRY_SIZE
    return mesh



    # Document Ready
$ -> new project.Main()
