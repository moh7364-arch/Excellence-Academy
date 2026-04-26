# إعداد Firebase للوحة تحكم AcademiaHub

## 1) إنشاء مشروع Firebase
1. افتح Firebase Console.
2. أنشئ مشروعاً جديداً.
3. أضف تطبيق Web App.
4. انسخ إعدادات `firebaseConfig` وضعها في الملف:

```text
js/firebase-config.js
```

## 2) تفعيل تسجيل الدخول
1. Authentication > Sign-in method.
2. فعّل Email/Password.
3. Authentication > Users > Add user.
4. أنشئ حساب المشرف بالبريد الذي تريده، واجعل كلمة المرور:

```text
Kaleem7364@
```

5. عدّل هذا السطر في `js/firebase-config.js` ليطابق بريد المشرف:

```js
export const ADMIN_EMAIL = "your-admin-email@example.com";
```

## 3) إنشاء Firestore Database
فعّل Cloud Firestore، ثم أضف هذه القواعد بعد استبدال البريد ببريد المشرف:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null && request.auth.token.email == "your-admin-email@example.com";
    }

    match /{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## 4) تفعيل Storage للصور والملفات
فعّل Firebase Storage، ثم أضف هذه القواعد بعد استبدال البريد ببريد المشرف:

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null && request.auth.token.email == "your-admin-email@example.com";
    }

    match /{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

## 5) رابط لوحة التحكم المخفية
لوحة التحكم لا تظهر داخل المنصة. ادخل إليها مباشرة من:

```text
/admin.html
```

مثال على GitHub Pages:

```text
https://USER.github.io/REPO/admin.html
```

## 6) ما يمكن إدارته من اللوحة
- إضافة/حذف الأعمال السابقة.
- رفع صور أو ملفات للأعمال.
- إضافة/حذف شهادات النشر والمشاركة والترجمة.
- رفع صور الشهادات وملفات PDF.
- إضافة/حذف خدمات جديدة.
- إضافة/حذف مميزات جديدة.
- إضافة/حذف آراء العملاء.

## ملاحظة أمنية مهمة
لا تعتمد على إخفاء الرابط وحده. الأمان الحقيقي هنا يعتمد على Firebase Authentication + قواعد Firestore/Storage أعلاه.
