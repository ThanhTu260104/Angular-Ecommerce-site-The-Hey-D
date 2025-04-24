import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const token = sessionStorage.getItem('token');
  const userRole = sessionStorage.getItem('vai_tro');

  if (token && userRole === '1') {
    // Logged in and is an admin
    return true;
  }

  // Not logged in or not an admin
  sessionStorage.setItem('thong_bao', 'Bạn cần đăng nhập với quyền quản trị để truy cập trang này.');
  router.navigate(['/login']);
  return false;
};
