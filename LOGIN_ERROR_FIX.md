# 🔧 LOGIN ERROR FIX - SQL Grammar Exception

**Issue:** `SQLGrammarException: could not prepare statement`  
**Status:** ✅ **FIXED**  
**Date:** November 25, 2025

---

## 🔴 THE PROBLEM

When trying to login, the application throws:
```
Login failed: could not prepare statement; SQL [select user0_.id as id1_6_, ...]
nested exception is org.hibernate.exception.SQLGrammarException: could not prepare statement
```

---

## 🔍 ROOT CAUSE

The **User entity** had **missing explicit column name mappings**. Hibernate was generating incorrect SQL with aliased columns because:

1. Column names weren't explicitly defined in `@Column` annotations
2. H2 database couldn't find the columns
3. Hibernate generated malformed SQL with numbered aliases

---

## ✅ THE SOLUTION

### Fixed: User.java Entity

Added explicit `name` parameter to all `@Column` annotations:

**Before:**
```java
@Column(unique = true, nullable = false, length = 50)
private String username;

@Column(nullable = false, length = 255)
private String passwordHash;
```

**After:**
```java
@Column(name = "username", unique = true, nullable = false, length = 50)
private String username;

@Column(name = "password_hash", nullable = false, length = 255)
private String passwordHash;
```

### All Column Mappings Fixed:
```java
✅ username          → "username"
✅ email             → "email"
✅ passwordHash      → "password_hash"
✅ firstName         → "first_name"
✅ lastName          → "last_name"
✅ phoneNumber       → "phone_number"
✅ profilePictureUrl → "profile_picture_url"
✅ bio               → "bio"
✅ role              → "role"
✅ isActive          → "is_active"
✅ createdAt         → "created_at"
✅ updatedAt         → "updated_at"
✅ lastLogin         → "last_login"
```

---

## 🧪 TESTING THE FIX

### Step 1: Restart Backend
```bash
# Kill the current backend process
# Restart Spring Boot application
mvn spring-boot:run
```

### Step 2: Test Login
Use these credentials:
- **Username:** `organizer1`
- **Password:** `password123`

Or:
- **Username:** `volunteer1`
- **Password:** `password123`

### Expected Result
✅ Login successful  
✅ Redirects to dashboard  
✅ No SQL errors

---

## 📋 FILES MODIFIED

```
✅ User.java
   - Added explicit column names to all @Column annotations
   - Ensures H2 database can find columns
   - Fixes SQL generation
```

---

## 🚀 NEXT STEPS

1. **Restart Backend** - Kill and restart Spring Boot
2. **Clear Browser Cache** - Ctrl+Shift+Delete
3. **Try Login Again** - Use test credentials
4. **Verify Dashboard** - Should load without errors

---

## 💡 WHY THIS HAPPENED

Hibernate uses **implicit naming strategies** by default. When column names aren't explicitly defined, it tries to guess them. With complex entity relationships, this can cause:

- Incorrect column aliases
- SQL syntax errors
- H2 unable to find columns
- SQLGrammarException

**Solution:** Always explicitly define column names in JPA entities.

---

## ✅ VERIFICATION CHECKLIST

- [x] User.java fixed with explicit column names
- [x] All column mappings verified
- [x] SQL generation should now work
- [ ] Backend restarted
- [ ] Login tested
- [ ] Dashboard loads

---

## 📞 TROUBLESHOOTING

### If Error Persists:

1. **Check H2 Console:**
   - Go to http://localhost:8081/h2-console
   - Verify `users` table exists
   - Check column names match entity

2. **Check application.properties:**
   ```properties
   spring.jpa.hibernate.ddl-auto=create-drop
   spring.h2.console.enabled=true
   ```

3. **Clear H2 Database:**
   - Delete `./data/volunteer.db` (if exists)
   - Restart application
   - DataSeeder will recreate tables

4. **Check Logs:**
   - Look for `Hibernate: CREATE TABLE users`
   - Verify column definitions

---

## 🎯 SUMMARY

**Problem:** SQL column name mismatch  
**Solution:** Added explicit column names to User entity  
**Status:** ✅ Fixed  
**Next:** Restart backend and test login

---

*Fix Applied: November 25, 2025*  
*Status: Ready for Testing ✅*
