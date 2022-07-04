import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk";
import logo from "./image/logo.png";
import "./MainP.css";

export default function MainP() {
  const mapRef = useRef(null);
  const side_bar_body = useRef(null);
  const [foodData, setFoodData] = useState([]);
  const [foodData2, setFoodData2] = useState([]);
  const [target_t, setSearch] = useState("");
  const [infoStatus, setInfoStatus] = useState(false);
  const [centerPos, setCenterPos] = useState({
    center: { lat: 35.1795543, lng: 129.0756416 },
    isPanto: false,
    level: 9,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setFoodData2(foodData.filter((x) => x.title.search(target_t) !== -1));
    console.log(foodData);
    console.log(target_t);
  };

  useEffect(() => {
    const fetchApi = async () => {
      await axios.get("http://localhost:8080").then((resp) => {
        makeData(resp.data);
      });
    };
    const makeData = (items) => {
      setFoodData(
        items.getFoodKr.item.map((x) => {
          return {
            key: x.UC_SEQ,
            title: x.MAIN_TITLE,
            lat: x.LAT,
            lng: x.LNG,
            url: x.MAIN_IMG_THUMB,
            addr: x.ADDR1,
            tel: x.CNTCT_TEL,
            runTime: x.USAGE_DAY_WEEK_AND_TIME,
            mainMenu: x.RPRSNTV_MENU,
            contents: x.ITEMCNTNTS,
          };
        })
      );
      setFoodData2(
        items.getFoodKr.item.map((x) => {
          return {
            key: x.UC_SEQ,
            title: x.MAIN_TITLE,
            lat: x.LAT,
            lng: x.LNG,
            url: x.MAIN_IMG_THUMB,
            addr: x.ADDR1,
            tel: x.CNTCT_TEL,
            runTime: x.USAGE_DAY_WEEK_AND_TIME,
            mainMenu: x.RPRSNTV_MENU,
            contents: x.ITEMCNTNTS,
          };
        })
      );
    };
    fetchApi();
  }, []);

  return (
    <>
      <div style={{ width: "100%" }}>
        <div style={{ width: "200px", float: "left" }} className="sidebar">
          <div className="sidebar-header">
            <img src={logo} style={{ backgroundColor: "black" }} alt="logo" />
          </div>
          <div className="sidebar-title">부산 맛집 지도</div>
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="search..."
              onChange={(e) => setSearch(e.target.value)}
              value={target_t}
            />
            <button
              type="button"
              className="btn-search"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>
          <div className="sidebar-body" ref={side_bar_body}>
            {foodData2.map((x) => {
              return (
                <li
                  key={x.key}
                  className="sidebar-body-item"
                  onClick={() => {
                    setCenterPos({
                      center: {
                        lat: x.lat,
                        lng: x.lng,
                      },
                      level: 2,
                    });
                    setInfoStatus(true);
                  }}
                >
                  {x.title}
                </li>
              );
            })}
          </div>
        </div>
        <div
          style={{
            width: "calc(100% - 200px)",
            height: "100vh",
            float: "left",
          }}
        >
          <Map // 지도를 표시할 Container
            center={centerPos.center}
            style={{
              // 지도의 크기
              width: "100%",
              height: "100vh",
            }}
            level={centerPos.level} // 지도의 확대 레벨
            ref={mapRef}
            isPanto={centerPos.isPanto}
            onZoomChanged={(target) =>
              setInfoStatus(target.getLevel() > 5 ? false : true)
            }
          >
            <MarkerClusterer
              averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
              minLevel={7} // 클러스터 할 최소 지도 레벨
              calculator={[5]}
            >
              {infoStatus ? mapMarkerWindow(foodData) : mapMarker(foodData)}
            </MarkerClusterer>
          </Map>
        </div>
      </div>
    </>
  );
}

const mapMarkerWindow = (dd) => {
  return dd.map((x) => {
    return (
      <MapMarker
        key={x.key}
        position={{
          lat: x.lat,
          lng: x.lng,
        }}
        infoWindowOptions={{ disableAutoPan: true }}
        onClick={() => markerClick(x)}
      >
        <div style={{ width: "150px", boxShadow: "0 0 4px black" }}>
          <div
            style={{
              backgroundImage: `url(${x.url})`,
              backgroundSize: "cover",
              height: "100px",
              width: "100%",
            }}
          ></div>
          <span style={{ padding: "8px", display: "block" }}>{x.title}</span>
        </div>
      </MapMarker>
    );
  });
};

const mapMarker = (dd) => {
  return dd.map((x) => {
    return (
      <MapMarker
        key={x.key}
        position={{
          lat: x.lat,
          lng: x.lng,
        }}
      />
    );
  });
};

const markerClick = (data) => {
  const temp = `${data.title}\n${data.addr}\n${data.tel}\n${data.runTime}\n${data.mainMenu}\n${data.contents}`;
  alert(temp);
};
