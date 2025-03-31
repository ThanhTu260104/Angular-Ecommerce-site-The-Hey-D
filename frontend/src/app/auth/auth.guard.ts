import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token || token.trim() === '') {
    console.warn('⚠️ Token không tồn tại');
    sessionStorage.setItem('thong_bao', 'Bạn chưa đăng nhập!');
    return router.createUrlTree(['/login']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      console.warn('⏰ Token đã hết hạn');
      localStorage.removeItem('token');
      sessionStorage.setItem('thong_bao', 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.');
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch (error) {
    console.error('❌ Lỗi khi giải mã token:', error);
    localStorage.removeItem('token');
    sessionStorage.setItem('thong_bao', 'Token không hợp lệ, vui lòng đăng nhập lại.');
    return router.createUrlTree(['/login']);
  }
};
