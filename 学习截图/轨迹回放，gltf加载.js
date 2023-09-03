1.自定义路线
自定义路线， 采集线路的过程。

var routeList = []; // 定义采集到的点集合
viewer.entities.add({
    polyline: {
        positions: new Cesium.CallbackProperty(function() { // 使用CallbackProperty实时更新绘制轨迹线
            return routeList;
        }, false),
        width: 5,
        material: Cesium.Color.RED,
        depthFailMaterial: Cesium.Color.RED,
        clampToGround: true
    }
}); // 添加到场景中
// 具体鼠标交互事件
viewer.screenSpaceEventHandler.setInputAction(function(clickEvent) {
    collectPoint(clickEvent.position);
}, Cesium.ScreenSpaceEventType.LEFT_CLICK); // 左击事件

viewer.screenSpaceEventHandler.setInputAction(function(moveEvent) {
    if (routeList.length >= 2) {
        routeList.pop();
        collectPoint(moveEvent.endPosition);
    } else if (routeList.length == 1) {
        collectPoint(moveEvent.endPosition);
    }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE); // 移动事件

viewer.screenSpaceEventHandler.setInputAction(function(clickEvent) {
    routeList.pop();
    collectPoint(clickEvent.position);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK); // 右击事件
// 采集点
function collectPoint(position) {
    var cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(position), viewer.scene);
    routeList.push(cartesian); // 存储每次踩点的位置
}
2.轨迹回放
轨迹回放用到的主要是Animation时钟控件、 TimeLine时间轴控件、 以及SampledPositionProperty接口对象之间的协作。

var entityFly = null; // 轨迹回放时实时位置代表的对象

var start = Cesium.JulianDate.fromDate(new Date(), new Cesium.JulianDate()); // 定义开始时间
var stop = Cesium.JulianDate.addSeconds(start, 180, new Cesium.JulianDate()); // 定义结束时间（示例总长180秒）

// 设置时钟参数
viewer.clock.startTime = start.clone();
viewer.clock.stopTime = stop.clone();
viewer.clock.currentTime = start.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
viewer.clock.multiplier = 1;

// 固定时间轴
viewer.timeline.zoomTo(start, stop);

// 使用SampledPositionProperty对象进行轨迹采样
function computeCircularTrack() {
    var property = new Cesium.SampledPositionProperty();
    for (var i = 0; i < routeList.length; i++) {
        var time = Cesium.JulianDate.addSeconds(start, i * 180 / (routeList.length - 1), new Cesium.JulianDate());
        var position = routeList[i];
        property.addSample(time, position);
    }
    return property;
}

var position = computeCircularTrack();

// 添加对象
entityFly = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
        start: start,
        stop: stop
    })]),
    position: position,
    orientation: new Cesium.VelocityOrientationProperty(position),
    model: {
        uri: './car.glb', // 加载模型
        minimumPixelSize: 128 // 指定模型大小
    },
    path: {
        show: false, // 显示轨迹
        resolution: 1,
        material: Cesium.Color.GREEN,
        width: 5
    }
});

// 指定轨迹插值算法
entityFly.position.setInterpolationOptions({
    interpolationDegree: 1,
    interpolationAlgorithm: Cesium.LinearApproximation // 线形，保证与绘制的路径一致
});
3.定义视角
在轨迹回放时， 物体时在实时变动的， 我们需要跟踪物体， 保证物体一直在我们的视野中。

1.trackedEntity
trackedEntity是Cesium在轨迹回放时默认的跟踪方法， 比较简单， 也比较实用， 物体会一直处在视野的正中心， 同时可以用鼠标拖拽场景。

2.lookAtTransform
固定住camera的视角， 类似第一视角的模式， 鼠标无法与场景进行交互。

function track() {
    var center = entityFly.position.getValue(viewer.clock.currentTime);
    var orientation = entityFly.orientation.getValue(viewer.clock.currentTime);
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
    transform = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), center);
    viewer.camera.lookAtTransform(transform, new Cesium.Cartesian3(-100.0, 0, 50));
}
viewer.clock.onTick.addEventListener(track);



加载gltf

1 1.定义模型所处位置集合

var treePositions = [
    [116.37937798457553, 39.90639040824304],
]

2.构造instances

var instances = [];
for (var i = 0; i < treePositions.length; i++) {
    var position = Cesium.Cartesian3.fromDegrees(treePositions[i][0], treePositions[i][1], 0); // 定位
    var modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, new Cesium.HeadingPitchRoll(0, 0, 0)); // 旋转
    Cesium.Matrix4.multiplyByUniformScale(modelMatrix, 0.2, modelMatrix); // 缩放
    instances.push({
        modelMatrix: modelMatrix
    });
}

3.添加instances集合

var collection = viewer.scene.primitives.add(new Cesium.ModelInstanceCollection({
    url: "wuyang.gltf",
    instances: instances
}));
