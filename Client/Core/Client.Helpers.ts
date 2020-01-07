import * as OriWeb from "./Client.ImportExportcontroller";

export interface IInvalidPropertyInfo
{
    message: string

    buildingBlockID: string
    fileName: string
    lineNumber: string
    
    validAPIValues: string[]
    validationRegex: string
    exclusionRegex: string
    validStrings: string[]
    exclusionStrings: string[]
}

export function Sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function WaitForSession()
{
    do
    {
        console.log("Waiting for OriClientSession to be established...");
        await Sleep(500);
    } while(globalThis.CurrentOriSession == undefined);
    return true;
}

export async function WaitForConnection()
{
    await WaitForSession();
    do
    {
        console.log("Waiting for OriClientSession to Connect...");
        await Sleep(500);
    } while(globalThis.CurrentOriSession.CheckConnection == false);
    return true;
}

export class InvalidPropertyException extends Error {
    readonly name: string = "InvalidPropertyException"
    message: string;

    exceptionInfo: IInvalidPropertyInfo

    constructor(exceptionInfo: IInvalidPropertyInfo) {
        super(exceptionInfo.message);
        this.exceptionInfo = exceptionInfo
        this.message = this.exceptionInfo.message
        
        console.error(exceptionInfo.message)
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidPropertyException.prototype);
    }
}

export class LineInfo
{
    fileName: string;
    lineNumber: number;
    columnNumber: number;

    constructor()
    {
        let newError = new Error()
        if(newError)
        if(newError.stack)
        {
            let stackLine = newError.stack.split("\n")[2];
            let caller_line = stackLine.slice(stackLine.lastIndexOf('/'),stackLine.lastIndexOf(')'))
            if ( caller_line.length == 0 ) {
                caller_line = stackLine.slice(stackLine.lastIndexOf('('),stackLine.lastIndexOf(')'))
            }
            let filename_base = caller_line.slice(0+1,caller_line.indexOf(':'));
            let line_no = caller_line.slice(caller_line.indexOf(':')+1,caller_line.lastIndexOf(':'));
            let line_pos = caller_line.slice(caller_line.lastIndexOf(':')+1);
            
            this.fileName = filename_base
            this.lineNumber = Number(line_no)
            this.columnNumber = Number(line_pos)
        }
    }

    public toString()
    {
        return this.fileName + " " + this.lineNumber + " " + this.columnNumber;
    }
}

function getElementByCaptureId(referenceCaptureId: string) {
    const selector = `[${getCaptureIdAttributeName(referenceCaptureId)}]`;
    return document.querySelector(selector);
}

function getCaptureIdAttributeName(referenceCaptureId: string) {
    return `_bl_${referenceCaptureId}`;
}

export function BlazorIDToElement(incomingObject: any): any
{
    let elementRefKey = '__internalId';

    let setValue = (path: string, value: Element | null) => {
        var schema = incomingObject;
        var pList = path.split('.');
        var len = pList.length;
        for(var i = 0; i < len-1; i++) {
            var elem = pList[i];
            if( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }

        schema[pList[len-1]] = value;
    };

    let iterateObject = (obj: any, stack: string | null = null): any => {
        for (var property in obj) {
            if (obj.hasOwnProperty(property)) {
                if (typeof obj[property] == "object") {
                    if(stack === null) stack = property
                    else stack = stack + "." + property
                    iterateObject(obj[property],  stack);
                } else {
                    if((property === elementRefKey) && typeof obj[property] === 'string')
                    {
                        if(stack !== null)
                            setValue(stack, getElementByCaptureId(obj[property]))
                    }
                }
            }
        }
    };

    

    iterateObject(incomingObject);
    return incomingObject;
}