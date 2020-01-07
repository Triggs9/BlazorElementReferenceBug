using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

using ElementReferenceBug_TestProject.Core.HTMLComponents;

using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace ElementReferenceBug_TestProject.Session
{
    public interface IOriComponent
    {
        RenderFragment Fragment { get; }
        dynamic ConvertToJSComponent();
    }
    
    public interface IOriWebSession
    {
        OriMainPage MainPage { get; set; } 

        Guid MyGuid { get; set; }

        void PushOriComponent(IOriComponent incomingComponent);
        Task PushJSOriComponent(IOriComponent incomingComponent);
    }
    
    public class OriComponent: IOriComponent
    {
        private IOriWebSession _currentSession { get; set; }
        
        private Dictionary<string, Dictionary<string, ElementReference>> _derivativeTags = new Dictionary<string, Dictionary<string, ElementReference>>();
        public RenderFragment Fragment { get; private set; }
        
        public ElementReference MyElement { get; private set; }

        public OriComponent(IOriWebSession incomingSession)
        {
            this._currentSession = incomingSession;
            
            // it would be really nice to be able to use html syntax here instead of RenderTreeBuilder, like JSX, as apposed to JS
            this.Fragment = builder =>
            {
                builder.OpenElement(0, "svg");
                builder.AddAttribute(1, "viewbox", "-100 -100 200 200");
                builder.AddAttribute(2, "height", "200px");
                builder.AddAttribute(3, "width", "200px");
                            
                builder.OpenElement(1, "text");

                //builder.AddAttribute(3, "fill", this.Properties.Font.Properties.Color.GetDefault());
                //builder.AddAttribute(4, "font-family", this.Properties.Font.Properties.Family.GetDefault());
                builder.AddAttribute(5, "x", "100");
                builder.AddAttribute(6, "y", "100");
                builder.AddAttribute(7, "text-anchor", "middle");
                builder.AddAttribute(8, "text-length", "0");
                builder.AddAttribute(9, "transform", "translate(0,0)");

                builder.AddElementReferenceCapture
                (
                    2,
                    textObj =>
                    {
                        // store a reference to this tag and wait for it to be mounted
                        this.MyElement = textObj;
                        // push the reference to js
                    }
                );

                builder.AddContent(10, "LabelTest");
                builder.CloseElement();  
                builder.CloseElement();
                        
            };
            
            this._currentSession.PushOriComponent(this);
        }
        
        public dynamic ConvertToJSComponent()
        {
            var newJSComponent = new
            {
                SomeTestVariable = "Built in an anonymous type",
                TextTag = this.MyElement
            };
            
            return newJSComponent;
        }
    }

    public class JSSessionInstance
    {
        public IOriWebSession MyWebSession { get; private set; }

        public string SessionGuid
        {
            get
            {
                if (this.MyWebSession != null) return this.MyWebSession.MyGuid.ToString();
                return null;
            }
        }

        public JSSessionInstance
            (IOriWebSession myWebSession)
        {
            this.MyWebSession = myWebSession;
        }

        [JSInvokable]
        public async Task<dynamic> BuildNewBuildingBlock()
        {
            IOriComponent newComponent = new OriComponent(this.MyWebSession);

            MyWebSession.PushJSOriComponent(newComponent);
            return newComponent.ConvertToJSComponent();
        }
    }

    public class OriWebSession : IOriWebSession
    {
        private IJSRuntime _currentJSRuntime { get; set; }

        private OriMainPage _mainPage;

        public OriMainPage MainPage
        {
            get { return this._mainPage; }
            set
            {
                if (this._mainPage == null)
                {
                    this._mainPage = value;
                    this.CheckBlazorLoaded();
                }
            }

        }

        public Guid MyGuid { get; set; }

        private TaskCompletionSource<Task> _initializationSource { get; set; }
        public Task Initialization { get; private set; }

        public OriWebSession
        (
            IJSRuntime incomingCurrentRuntime    
        )
        {
            this.MyGuid = Guid.NewGuid();
            Console.WriteLine("OriWebSessionStarted: " + this.MyGuid);
            this._currentJSRuntime = incomingCurrentRuntime;
            
            this._initializationSource = new TaskCompletionSource<Task>();

            this.Initialization = this._initializationSource.Task;
        }

        private async Task CheckBlazorLoaded()
        {
            if (
                this.MainPage != null
            )
            {
                await this.InitalizeAsync();
            }
        }

        public void PushOriComponent(IOriComponent incomingComponent)
        {
            this.MainPage.AddNewOriComponent(incomingComponent);
        }

        public async Task PushJSOriComponent(IOriComponent incomingComponent)
        {
            object dynamicCast = incomingComponent.ConvertToJSComponent();
            await this._currentJSRuntime.InvokeVoidAsync("OriJSClientCalls.RecieveComponent", dynamicCast);
        }

        public async Task InitalizeAsync()
        {
            var newJSSessionInstance = DotNetObjectReference.Create(new JSSessionInstance(this));
            await this._currentJSRuntime.InvokeVoidAsync("OriJSClientCalls.InjectIntoJSSession", newJSSessionInstance);

            this._initializationSource.SetResult(Task.CompletedTask);
        }
    }
}