const { kakao } = window;

export default function KakaoMapScript() {
    const container = document.getElementById('myMap');
    const options = {
        center: new kakao.maps.LatLng(36.798860, 127.07555),
        level: 4
    };
    const map = new kakao.maps.Map(container, options);

}