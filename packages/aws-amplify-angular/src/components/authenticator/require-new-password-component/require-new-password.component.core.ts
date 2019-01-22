// tslint:disable
/*
 * Copyright 2017-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
// tslint:enable

import { Component, Input, Inject } from '@angular/core';
import * as AmplifyUI from '@aws-amplify/ui';
import { classArray } from '../../../assets/helpers';
import { AmplifyService, AuthState } from '../../../providers';

const template = `
<div class="{{applyClasses('formSection')}}"  *ngIf="_show">
  <div class="{{applyClasses('sectionHeader')}}">
    {{this.header}}
  </div>
  <div class="{{applyClasses('sectionBody')}}">
    <div class="{{applyClasses('formField')}}">
      <div class="{{applyClasses('inputLabel')}}"> Password * </div>
      <input #password
        (keyup)="setPassword(password.value)"
        (keyup.enter)="onSubmit()"
       class="{{applyClasses('input')}}"
        type="password"
        placeholder="Password"
      />
    </div>
  </div>
  <div class="{{applyClasses('sectionFooter')}}">
    <span class="{{applyClasses('sectionFooterPrimaryContent')}}">
      <a class="{{applyClasses('a')}}" (click)="onSignIn()">Back to Sign In</a>
    </span>
    <span class="{{applyClasses('sectionFooterSecondaryContent')}}">
      <button class="{{applyClasses('button')}}" (click)="onSubmit()">
        Submit
      </button>
    </span>
  </div>
  <div class="{{applyClasses('amplifyAlert')}}" *ngIf="errorMessage">
    <div class="{{applyClasses('amplifyAlertBody')}}">
      <span class="{{applyClasses('amplifyAlertIcon')}}">&#9888;</span>
      <div class="{{applyClasses('amplifyAlertMessage')}}">{{ errorMessage }}</div>
      <a class="{{applyClasses('amplifyAlertClose')}}" (click)="onamplifyAlertClose()">&times;</a>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'amplify-auth-require-new-password-core',
  template
})
export class RequireNewPasswordComponentCore {
  _authState: AuthState;
  _show: boolean;
  _requireNewPasswordConfig: any;
  _classOverrides: any;
  header: string = 'You are required to update your password';
  password: string;
  errorMessage: string;
  amplifyService: AmplifyService;
  amplifyUI: AmplifyUI;

  constructor(@Inject(AmplifyService) amplifyService: AmplifyService) {
    this.amplifyService = amplifyService;
    this.amplifyUI = Object.assign({}, AmplifyUI);
    this._classOverrides = {};
    this._requireNewPasswordConfig = {};
  }

  @Input()
  set data(data: any) {
    this._authState = data.authState;
    this._show = data.authState.state === 'requireNewPassword';
    if (data.requireNewPasswordConfig) {
      this._requireNewPasswordConfig = data.requireNewPasswordConfig;
    }
    if (this._requireNewPasswordConfig.header) {
      this.header = this._requireNewPasswordConfig.header;
    }
    if (data.classOverrides) {
      this._classOverrides = data.classOverrides;
    }
  }

  @Input()
  set authState(authState: AuthState) {
    this._authState = authState;
    this._show = authState.state === 'requireNewPassword';
  }

  @Input()
  set requireNewPasswordConfig(requireNewPasswordConfig: any) {
    this._requireNewPasswordConfig = requireNewPasswordConfig;
    if (this._requireNewPasswordConfig.header) {
      this.header = this._requireNewPasswordConfig.header;
    }
  }

  @Input()
  set classOverrides(classOverrides) {
    this._classOverrides = classOverrides;
  }


  setPassword(password: string) {
    this.password = password;
  }

  applyClasses(element) {
    return classArray(
      element, 
      { global: this._classOverrides, component: this._requireNewPasswordConfig.classOverrides}
    );
  }

  onSubmit() {
    const { user } = this._authState;
    const { requiredAttributes } = user.challengeParam;
    this.amplifyService.auth()
      .completeNewPassword(
        user,
        this.password,
        requiredAttributes
      )
      .then(() => {
        this.amplifyService.setAuthState({ state: 'signIn', user });
      })
      .catch(err => this._setError(err));
  }

  onSignIn() {
    this.amplifyService.setAuthState({ state: 'signIn', user: null });
  }

  onamplifyAlertClose() {
    this._setError(null);
  }

  _setError(err) {
    if (!err) {
      this.errorMessage = null;
      return;
    }

    this.errorMessage = err.message || err;
  }
}
