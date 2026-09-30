# lib — مكتبات مشتركة للنماذج

مكتبة three.js مشتركة بين كل النماذج، تُحمَّل مرة واحدة بدل تضمينها داخل كل ملف.

- `three-r147.min.js` + `OrbitControls-r147.js` — إصدار قالب الـSkill، لكل النماذج الجديدة
- `three-r128.min.js` + `OrbitControls-r128.js` — للنماذج القديمة (3f83، 56ab)

في ملف `p/<المشروع>/index.html`:

```html
<script src="../../lib/three-r147.min.js"></script>
<script src="../../lib/OrbitControls-r147.js"></script>
```
