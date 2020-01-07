﻿using System.Collections.Generic;

 using ElementReferenceBug_TestProject.Session;

 using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;
using Microsoft.JSInterop;

namespace ElementReferenceBug_TestProject.Core.HTMLComponents
{
    public class OriMainPage : ComponentBase
    {
        [Inject]private IOriWebSession _currentSession { get; set; }
        [Inject]private IJSRuntime _currentRuntime { get; set; }
        
        private List<IOriComponent> _activeOriComponents { get; set; }

        protected override void OnInitialized()
        {
            this._activeOriComponents = new List<IOriComponent>();
            this._currentSession.MainPage = this;
            
            base.OnInitialized();
        }
        
        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            base.BuildRenderTree(builder);
            
            if (this._activeOriComponents != null)
            {
                if (this._activeOriComponents.Count > 0)
                {
                    foreach (IOriComponent component in this._activeOriComponents)
                    {
                        builder.AddContent(0,component.Fragment);
                    }
                }
            }
        }
        
        public void AddNewOriComponent(IOriComponent incomingComponent)
        {
            this._activeOriComponents.Add(incomingComponent);
            this.PushStateChange();
        }
        
        public void PushStateChange()
        {
            base.InvokeAsync(StateHasChanged);
        }
    }
}

