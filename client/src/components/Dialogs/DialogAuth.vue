<template lang="pug">
  v-dialog(v-model="value", persistent, width=350)
    div(v-if="mode === 'login'")
      v-tabs(fixed-tabs, centered, :color="tabColor", :slider-color="sliderColor", v-model="dialogTab" @change="doChangeTabs")
        v-tab(:disabled="networkBusy") Sign in
        v-tab(:disabled="networkBusy") Register

      v-tabs-items(v-model="dialogTab")
        v-tab-item
          v-card
            v-alert.banner(type="error" :value="showSignInError" transition="scale-transition" dismissible) {{ signInError }}
            v-form(ref="signInForm", v-model="signInValid")
              v-card-text
                v-text-field(v-model="signInEmail", label="Email Address", required,
                            append-icon="fa-envelope", :disabled="networkBusy",
                            :rules="rules.email")
                v-text-field(v-model="signInPassword", label="Password", required,
                            :append-icon="showSignInPassword ? 'fa-eye-slash' : 'fa-eye'",
                            :type="showSignInPassword ? 'text' : 'password'",
                            :disabled="networkBusy", :rules="rules.password",
                            @click:append="showSignInPassword = !showSignInPassword")
                v-card-actions
                  v-btn(block, :color="buttonColor", @click="doSignIn", :disabled="!signInValid || networkBusy")
                    v-progress-circular(v-if="networkBusy", indeterminate, :size="15", :width="2")
                    | Sign In
                v-card-actions
                  v-btn(block, @click="closeDialog", :disabled="networkBusy") Cancel
                v-card-actions
                  v-btn.caption.font-weight-light(block, text, small, :ripple="false", @click="showChangePassword = true", :disabled="networkBusy") Forgot Password
                  v-btn.caption.font-weight-light(block, text, small, :ripple="false", @click="gotoConfirm", :disabled="networkBusy") Confirm Account

        v-tab-item
          v-card
            v-alert.banner(type="error" :value="showRegisterError" transition="scale-transition" dismissible) {{ registerError }}
            v-form(ref="registerForm", v-model="registerValid")
              v-card-text
                v-text-field(v-model="regEmail", label="Email Address", required,
                            append-icon="fa-envelope", :disabled="networkBusy",
                            :rules="rules.email")
                v-text-field(ref="regPassword", v-model="regPassword", label="Password", required,
                            type="password", :disabled="networkBusy", :rules="rules.newPassword")
                v-text-field(v-model="regConfirmPassword", label="Confirm Password", required,
                            type="password", :disabled="networkBusy", :rules="rules.confirmPassword")
                v-menu(v-if="showBirthdate", ref="birthdateMenu", :close-on-content-click="false", :disabled="networkBusy",
                        v-model="showBirthdatePopup",
                        :return-value.sync="regBirthdate",
                        lazy,
                        transition="scale-transition",
                        offset-y,
                        full-width,
                        min-width="290px")
                  v-text-field(slot="activator", :disabled="networkBusy",
                                v-model="regBirthdateFormatted",
                                label="Birthday",
                                append-icon="fa-calendar",
                                :rules="rules.birthdateRules",
                                readonly)
                  v-date-picker(ref="birthdatePicker", v-model="regBirthdate", color="teal lighten-2",
                                :disabled="networkBusy", :max="new Date().toISOString().substr(0, 10)",
                                @input="$refs.birthdateMenu.save(regBirthdate)")
                v-card-actions
                  v-btn(block, :color="buttonColor", @click="doRegister", :disabled="!registerValid || networkBusy")
                    v-progress-circular(v-if="networkBusy", indeterminate, :size="15", :width="2")
                    | Register
                v-card-actions
                  v-btn(block @click="closeDialog", :disabled="networkBusy") Cancel

    div(v-if="mode == 'confirm'")
      v-card
        v-form(ref="confirmForm", v-model="confirmValid")
          v-toolbar(:color="tabColor" dense)
            v-spacer
            v-toolbar-title.body-2 CONFIRM ACCOUNT
            v-spacer
          v-alert.banner(type="error" :value="showConfirmError" transition="scale-transition" dismissible) {{ confirmError }}
          v-card-text
            v-text-field(v-model="confirmEmail", label="Email Address", required,
                        append-icon="fa-envelope", :disabled="networkBusy",
                        :rules="rules.email")
            v-text-field(v-model="confirmCode", label="Code", required,
                        :disabled="networkBusy", :rules="rules.required")
            v-card-actions
              v-btn(block, :color="buttonColor", @click="doConfirm", :disabled="!confirmValid || networkBusy")
                v-progress-circular(v-if="networkBusy", indeterminate, :size="15", :width="2")
                | Confirm
            v-card-actions
              v-btn(block @click="closeDialog", :disabled="networkBusy") Cancel

</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

enum DialogMode {
  LOGIN = 'login',
  REGISTER = 'register',
  CONFIRM = 'confirm',
  FORGOT = 'edit',
}

@Component
export default class DialogAuth extends Vue {
  @Prop({ default: false })
  public value!: boolean;
  @Prop({ default: '' })
  public tabColor!: string;
  @Prop({ default: '' })
  public sliderColor!: string;
  @Prop({ default: '' })
  public buttonColor!: string;
  @Prop({ default: 0 })
  public minAge!: number;

  private rules = {
    email: [
      (v: string) => !!v || 'An e-mail is required to continue.',
      (v: string) => /.+@.+/.test(v) || 'Must be a valid e-mail address.',
    ],
    password: [
      (v: string) => !!v || 'A password is required to continue..',
    ],
    newPassword: [
      (v: string) => !!v || 'A password is required to continue.',
      (v: string) => (v && v.length >= 8) || 'Must be at least 8 characters.',
    ],
    confirmPassword: [
      (v: string) => !!v || 'Confirm password to continue',
      (v: string) => (v === (this.$refs.regPassword as HTMLInputElement).value) || 'Passwords must match to continue.',
    ],
    birthdateRules: [
      (v: string) => !!v || 'A birth date is required to continue.',
    ],
  };

  private mode: DialogMode = DialogMode.LOGIN;
  private dialogTab: number = 0;

  private networkBusy: boolean = false;

  private signInValid: boolean = false;
  private registerValid: boolean = false;
  private confirmValid: boolean = false;
  private forgotValid: boolean = false;
  private changeValid: boolean = false;

  private showSignInError: boolean = false;
  private showSignInPassword: boolean = false;
  private signInError: string = '';
  private signInEmail: string = '';
  private signInPassword: string = '';

  private showRegisterError: boolean = false;
  private showBirthdatePopup: boolean = false;
  private registerError: string = '';
  private regName: string = '';
  private regEmail: string = '';
  private regPassword: string = '';
  private regConfirmPassword: string = '';
  private regBirthdateFormatted: string = '';
  private regBirthdate: string = '';

  private showChangePassword: boolean = false;

  private showConfirmError: boolean = false;
  private confirmError: string = '';
  private confirmEmail: string = '';
  private confirmCode: string = '';

  private forgotEmail: string = '';
  private changePassword: string = '';
  private changeConfirmPassword: string = '';
  private changeCode: string = '';

  // Computed Properties
  get showBirthdate() {
    return !!this.minAge;
  }

  // Methods
  private clearForms() {
    this.showSignInError = false;
    this.showConfirmError = false;
    this.showRegisterError = false;
    if (this.$refs.signInForm) {
      (this.$refs.signInForm as HTMLFormElement).reset();
    }
    if (this.$refs.registerForm) {
      (this.$refs.signInForm as HTMLFormElement).reset();
    }
    if (this.$refs.confirmForm) {
      (this.$refs.signInForm as HTMLFormElement).reset();
    }
  }

  private closeDialog() {
    this.$emit('input', false);
    this.clearForms();
    this.mode = DialogMode.LOGIN;
    this.dialogTab = 0;
  }

  private doChangeTabs() {
    this.clearForms();
  }

  private doRegister() {
    this.networkBusy = true;
    this.showRegisterError = false;
    this.$store.dispatch('cognito/registerUser', {
      username: this.regEmail,
      password: this.regPassword,
      attributes: {
        email: this.regEmail,
      },
    }).then(() => {
      this.networkBusy = false;
      this.confirmEmail = this.regEmail;
      this.mode = DialogMode.CONFIRM;
      this.dialogTab = 0;
    }).catch((err) => {
      this.registerError = 'Could not create user account, please try again later.';
      if (err.code === 'UsernameExistsException') {
        this.registerError = 'A user with that email already exists.';
      }
      this.showRegisterError = true;
      this.networkBusy = false;
    });
  }

  private doSignIn() {
    this.networkBusy = true;
    this.showSignInError = false;
    this.$store.dispatch('cognito/signInUser', {
      username: this.signInEmail,
      password: this.signInPassword,
    }).then(() => {
      this.networkBusy = false;
      this.closeDialog();
    }).catch((err) => {
      if (err && err.code === 'NotAuthorizedException') {
        this.signInError = 'Invalid account or password.';
      } else if (err && err.code === 'UserNotFoundException') {
        this.signInError = 'Invalid account or password.';
      } else {
        this.signInError = err.message || err;
      }
      this.showSignInError = true;
      this.networkBusy = false;
    });
  }

  private doConfirm() {
    this.networkBusy = true;
    this.$store.dispatch('cognito/confirmUser', {
      username: this.confirmEmail,
      code: this.confirmCode,
    }).then(() => {
      this.networkBusy = false;
      if (this.$store.getters['cognito/isLoggedIn']) {
        this.closeDialog();
      } else {
        this.clearForms();
        this.mode = DialogMode.LOGIN;
        this.dialogTab = 0;
      }
    }).catch((err) => {
      if (err && err.code === 'UserNotFoundException') {
        this.confirmError = 'Invalid account or code.';
      } else if (err && err.code === 'NotAuthorizedException') {
        this.confirmError = 'Account already confirmed.';
      } else if (err && err.code === 'CodeMismatchException') {
        this.confirmError = 'Confirmation code is invalid.';
      } else {
        this.confirmError = err.message || err;
      }
      console.log(err);
      this.showConfirmError = true;
      this.networkBusy = false;
    });
  }

  private gotoConfirm() {
    this.mode = DialogMode.CONFIRM;
    this.dialogTab = 0;
  }
}
</script>

<style lang="scss" scoped>
.banner {
  margin: 0;
  padding: 0.5em;
  z-index: 99;
}
</style>
