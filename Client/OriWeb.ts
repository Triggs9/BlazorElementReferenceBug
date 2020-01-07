import * as OriWeb from './Core/Client.ImportExportcontroller';
import {Helpers} from "./Core/Client.ImportExportcontroller";

declare var Blazor: any;

(function(){
    Blazor.start({}).then(() => {
        console.debug("Blazor has connected");
        
        Object.defineProperty(window, "CurrentOriSession", {
            value: new OriWeb.Core.OriWebClientSession(),
            writable: false
        });
    })
})();

(async () =>{
    await Helpers.WaitForConnection();

    let OriComponent2 = await globalThis.CurrentOriSession.WorkingNewBuildingBlock();
    let OriComponent3 = await globalThis.CurrentOriSession.FailedNewBuildingBlock();
    (globalThis as any).WorkingComponent = OriComponent2;
    (globalThis as any).FailedComponent = OriComponent3;
    
    console.log("New buildingblock called")
})();
