﻿/// <reference types="@microsoft/Blazor/Microsoft.JSInterop" />

import * as Core from './Core/Client.Core'

export declare global
{
    namespace globalThis {
        var OriJSClientCalls: Core.AvailableClientCalls;
        var CurrentOriSession: Core.OriWebClientSession;
    }    
}