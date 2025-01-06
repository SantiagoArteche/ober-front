import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct route links', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('button[routerLink]');
    expect(links[0].getAttribute('routerLink')).toBe('/projects');
    expect(links[1].getAttribute('routerLink')).toBe('/tasks');
  });

  it('should have correct title with routerLink', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h1[routerLink]');
    expect(title.textContent.trim()).toBe('Gestión de tareas y proyectos');
    expect(title.getAttribute('routerLink')).toBe('/');
  });

  it('should call logout method when logout button is clicked', () => {
    spyOn(component, 'logout');
    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('button:not([routerLink])');
    logoutButton.click();
    expect(component.logout).toHaveBeenCalled();
  });

  it('should remove token and navigate to login page on logout', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(router, 'navigate');
    component.token = 'test-token';
    component.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should not navigate if token is null on logout', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(router, 'navigate');
    component.token = null;
    component.logout();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
