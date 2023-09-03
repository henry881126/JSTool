<template>
    <div id="mapCon" style="" class="mapCon">
        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content" class="olFramedCloudPopupContent"></div>

            <div id="mouse-position"></div>
        </div>
        <div id="explanation"></div>
    </div>
</template>

<script>
// const EncMap = window.EncMap;

export default {
    name: '',
    components: {},
    props: {},
    data() {
        return {};
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {
        this.initMap();
    },
    methods: {
        initMap() {
            var providelayer = new window.EncMap.ENCLayerProvider();

            var optionInfo = {
                centerX: 12976694.29785,
                centerY: 4743563.564,
                zoom: 5,
                minZoom: 0,
                maxZoom: 20,
                layer: []
            };
            var encMap = new window.EncMap.Map('mapCon', optionInfo);

            var webKey = 'f50a580b75898a7e26dca2dfe3ad910e';
            var wmtsUrl_1 = 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?tk='; //矢量底图
            var wmtsUrl_2 = 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?tk='; //矢量注记

            /*加载TileWMTS格式切片服务*/
            //var wmtsTile = 'http://10.19.151.238:8080/geowebcache/service/wms';
            var wmtsTile1 = wmtsUrl_1 + webKey;
            var wmtsTile2 = wmtsUrl_2 + webKey;

            var wmtsParam1 = {};
            //对应源代码中的投影
            wmtsParam1.projection = providelayer.getProjection('EPSG:3857');
            wmtsParam1.url = wmtsTile1;
            wmtsParam1.layers = 'tianditu';
            wmtsParam1.layer = 'vec';
            wmtsParam1.format = 'tiles';
            wmtsParam1.SRS = 'EPSG:3857';

            var wmtsParam2 = {};
            //对应源代码中的投影
            wmtsParam2.projection = providelayer.getProjection('EPSG:3857');
            wmtsParam2.url = wmtsTile2;
            wmtsParam2.layers = 'tianditu';
            wmtsParam2.layer = 'cva';
            wmtsParam2.format = 'tiles';
            wmtsParam2.SRS = 'EPSG:3857';

            encMap.addLayer(
                providelayer.getTianDiTuLayer(
                    wmtsTile1,
                    wmtsParam1,
                    '1',
                    'ditu'
                ),
                'ditu'
            );
            encMap.addLayer(
                providelayer.getTianDiTuLayer(
                    wmtsTile2,
                    wmtsParam2,
                    '2',
                    'txt'
                ),
                'txt'
            );
        }
    }
};
</script>

<style lang='scss' scoped>
.mapCon {
    height: 100%;
}
</style>