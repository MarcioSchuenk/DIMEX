

import maintenance from "../assets/maintenance.svg"

export const MaintenancePage = () => {
    return (
        <div className="container-maintenance">
            <p className="p-maintenance">Esta página está em desenvolvimento</p>
            <img src={maintenance} alt="Manutenção" className="maintenance"/>
        </div>
    );
};