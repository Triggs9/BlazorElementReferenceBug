/// <reference types="@microsoft/Blazor/Microsoft.JSInterop" />

import * as OriWeb from './Client.ImportExportcontroller'
import {Helpers} from "./Client.ImportExportcontroller";

export class AvailableClientCalls
{
    public ReloadBrowser() {
        console.log("Webpack change, reloading...")
        location.reload();
    }
    
    public async InjectIntoJSSession(myOriWebSession: DotNet.DotNetObject): Promise<Boolean>{
        console.log("DotNetInterop Inject called from server")
        console.log(myOriWebSession)
        await OriWeb.Helpers.WaitForSession();
    
        if(globalThis.CurrentOriSession != undefined)
        {
            let injectionResults: Boolean = globalThis.CurrentOriSession.InjectDotNetInterop(myOriWebSession);
            if(!injectionResults)
            {
                console.error();
            }
            return Promise.resolve(injectionResults);
        }
        else
        {
            console.error();
        }
        return Promise.resolve(false);
    }

    public RecieveComponent(component: object) {
        console.log("recieved list of components");
        console.log(component);
        (globalThis as any).WorkingThroughJSParam = component;
    }
}

// JS Callable Functions
globalThis.OriJSClientCalls = new AvailableClientCalls();
Object.freeze(globalThis.OriJSClientCalls);

export class OriWebClientSession
{
    private _dotNetInterop: DotNet.DotNetObject;
    public NewOriComponent: any;
    
    get CheckConnection(): boolean {
        if(this._dotNetInterop != undefined)
        {
            return true;
        }
        return false
    }
    
    constructor()
    {
    }

    InjectDotNetInterop(incomingInterop: DotNet.DotNetObject): Boolean
    {
        if(this._dotNetInterop == undefined)
        {
            this._dotNetInterop = incomingInterop;
        }

        if(this._dotNetInterop != undefined)
        {
            console.log("DotNetInterop Injected");
            console.log(this._dotNetInterop);
            return true;
        }
        return false;
    }
    
    public async WorkingNewBuildingBlock(): 
    Promise<any>    
    {
        if(this.CheckConnection)
        {
            let newComponent: any
                = Helpers.BlazorIDToElement(await this._dotNetInterop.invokeMethodAsync("BuildNewBuildingBlock")); 
            return newComponent;
        }
        else
        {
        }
    }

    public async FailedNewBuildingBlock():
        Promise<any>
    {
        if(this.CheckConnection)
        {
            let newComponent: any
                = await this._dotNetInterop.invokeMethodAsync("BuildNewBuildingBlock");
            return newComponent;
        }
        else
        {
        }
    }
}


