import { Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { User } from '../_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertService: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.bsConfig = {
      containerClass: 'theme-blue',
    };
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = this.fb.group(
      {
        gender: ['male'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator,
      }
    );
  }

  passwordMatchValidator(g: FormGroup): object {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  register(): void {
    /*  this.authService.register(this.model).subscribe(
      () => {
        this.alertService.success('Registration successful');
      },
      (error) => {
        this.alertService.error(error);
      }
    ); */
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        (res) => {
          this.alertService.success('Registration successful');
        },
        (error) => {
          this.alertService.error(error);
        },
        () => {
          //metodo para cuando se completa el success
          this.authService.login(this.user).subscribe((res) => {
            this.router.navigate(['/members']);
          });
        }
      );
    }
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    this.alertService.message('cancelled');
  }

  // Validation errors

  isInvalid(c: string): boolean {
    return (
      this.registerForm.get(c).hasError('required') &&
      this.registerForm.get(c).touched
    );
  }

  MinLength(c: string): boolean {
    return (
      this.registerForm.get(c).hasError('minlength') &&
      this.registerForm.get(c).touched
    );
  }

  MaxLength(c: string): boolean {
    return (
      this.registerForm.get(c).hasError('maxlength') &&
      this.registerForm.get(c).touched
    );
  }

  ConfirmPasswordValidation(c: string): boolean {
    return (
      this.registerForm.hasError('mismatch') && this.registerForm.get(c).touched
    );
  }
}
