import React, { useState } from "react";
import styles from "./styles.module.scss";
import "boxicons/css/boxicons.min.css";
import profile from "../../assets/profile.jpg";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export const Sidebar = () => {
  const [isActive, setIsActive] = useState(true);
  const [openCard, setOpenCard] = useState(null);

  const toggleSidebar = () => {
    setIsActive(!isActive);
  };

  const toggleCard = (cardName) => {
    setOpenCard(openCard === cardName ? null : cardName);
  };

  return (
    <div className={`${styles.sidebar} ${isActive ? styles.active : ""}`}>
      <div className={styles.logo_content}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" className={styles.logo_image} />
          <div className={styles.logo_name}>Dimex</div>
        </div>
        <i className="bx bx-menu" id={styles.btn} onClick={toggleSidebar}></i>
      </div>

      <ul className={styles.nav_list}>
        {/* Expedição */}
        <li onClick={() => toggleCard("expedicao")}>
          <a>
            <i className="bx bx-package"></i>
            <span className={styles.links_name}>Expedição</span>
            <span className={styles.arrow_toggle}>
              <i
                className={`bx ${
                  openCard === "expedicao" ? "bx-chevron-up" : "bx-chevron-down"
                }`}
              ></i>
            </span>
          </a>
          <span className={styles.tooltip}>Expedição</span>
        </li>
        {isActive && openCard === "expedicao" && (
          <div>
            <li className={styles.subItem}>
              <Link to="/fluxo_nobre">
                <i className="bx bx-right-arrow"></i>
                <span className={styles.links_name}>Fluxo Sala Nobre</span>
              </Link>
            </li>
          </div>
        )}

        {/* Rodoviário */}
        <li onClick={() => toggleCard("rodoviario")}>
          <a>
            <i className="bx bx-map"></i>
            <span className={styles.links_name}>Rodoviário</span>
            <span className={styles.arrow_toggle}>
              <i
                className={`bx ${
                  openCard === "rodoviario"
                    ? "bx-chevron-up"
                    : "bx-chevron-down"
                }`}
                style={{ marginLeft: "auto" }}
              ></i>
            </span>
          </a>
          <span className={styles.tooltip}>Rodoviário</span>
        </li>
        {isActive && openCard === "rodoviario" && (
          <div>
            <li>
              <Link to="https://app.pipefy.com/pipes/306350886" target="_blank">
                <i className="bx bx-right-arrow"></i>
                <span className={styles.links_name}>CRM Romaneio</span>
              </Link>
            </li>
          </div>
        )}
        {/* Oficina */}
        <li onClick={() => toggleCard("oficina")}>
          <a>
            <i className="bx bx-buildings"></i>
            <span className={styles.links_name}>Oficina</span>
            <span className={styles.arrow_toggle}>
              <i
                className={`bx ${
                  openCard === "oficina" ? "bx-chevron-up" : "bx-chevron-down"
                }`}
                style={{ marginLeft: "auto" }}
              ></i>
            </span>
          </a>
          <span className={styles.tooltip}>Oficina</span>
        </li>
        {isActive && openCard === "oficina" && <div></div>}
      </ul>

      <div className={styles.profile_content}>
        <div className={styles.profile}>
          <div className={styles.profile_details}>
            <img src={profile} alt="Profile" />
            <div className={styles.name_job}>
              <div className={styles.name}>Pedro</div>
              <div className={styles.job}>Developer</div>
            </div>
          </div>
          <Link to="/login">
            <i className="bx bx-log-out" id={styles.log_out}></i>
          </Link>
        </div>
      </div>
    </div>
  );
};
