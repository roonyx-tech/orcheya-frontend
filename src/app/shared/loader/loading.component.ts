import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `<div class="loading">
              <div id="loader" class="lds-dual-ring"></div>
            </div>`,
  styles: [
    `.loading {
        height: 100%;
        width: 100%;
        display: inline-flex;
        z-index: 100;
        background-color: rgba(255, 255, 255, .3);
    }`,

    `.lds-dual-ring {
        margin: auto;
        align-self: center;
        width: 64px;
        height: 64px;
    }`,

    `.lds-dual-ring:after {
        content: "";
        display: block;
        width: 46px;
        height: 46px;
        margin: 1px;
        border-radius: 50%;
        border: 5px solid #000;
        border-color: #000 transparent #000 transparent;
        animation: lds-dual-ring 1.2s linear infinite;
    }`,

    `@keyframes lds-dual-ring {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }`
  ]
})
export class LoadingComponent { }
