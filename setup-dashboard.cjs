#!/usr/bin/env node
// Installs all platform pages into src/app/ — runs automatically via `npm run dev` predev hook
const fs   = require('fs');
const path = require('path');

const ROOT = __dirname;

const PAGES = [
  { src: '_dashboard_page.tsx',        dest: 'src/app/dashboard/page.tsx' },
  { src: '_map_page.tsx',              dest: 'src/app/map/page.tsx' },
  { src: '_sponsors_page.tsx',         dest: 'src/app/sponsors/page.tsx' },
  { src: '_sales_page.tsx',            dest: 'src/app/sales/page.tsx' },
  { src: '_api_sales_sms_route.ts',    dest: 'src/app/api/sales/sms/route.ts' },
  { src: '_api_sales_call_route.ts',   dest: 'src/app/api/sales/call/route.ts' },
  { src: '_api_sales_payment_route.ts',dest: 'src/app/api/sales/payment/route.ts' },
];

for (const { src, dest } of PAGES) {
  const srcPath  = path.join(ROOT, src);
  const destPath = path.join(ROOT, dest);
  const destDir  = path.dirname(destPath);
  if (!fs.existsSync(srcPath)) { console.warn('skipped (missing source):', src); continue; }
  if (!fs.existsSync(destDir)) { fs.mkdirSync(destDir, { recursive: true }); }
  fs.copyFileSync(srcPath, destPath);
  console.log('✓', dest);
}
