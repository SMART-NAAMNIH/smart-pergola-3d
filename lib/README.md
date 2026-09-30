# lib — مكتبات مشتركة للنماذج

مكتبة three.js مشتركة بين كل النماذج، تُحمَّل مرة واحدة بدل تضمينها داخل كل ملف.

- `three-r128.min.js` + `OrbitControls-r128.js` — الإصدار المعتمد للنماذج الجديدة
- `three-r147.min.js` + `OrbitControls-r147.js` — يستخدمه HS-2026-2909-D-1f75 فقط

في ملف `p/<المشروع>/index.html`:

```html
<script src="../../lib/three-r128.min.js"></script>
<script src="../../lib/OrbitControls-r128.js"></script>
```
