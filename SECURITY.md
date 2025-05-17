# Security Policy

## Supported Versions

This project is committed to addressing critical security vulnerabilities in actively maintained releases.  
**Always use the latest version** to ensure security fixes and improvements.

| Version | Supported          | Status               |
| ------- | ------------------ | -------------------- |
| 1.x.x   | :white_check_mark: | Active (LTS)         |
| 0.x.x   | :x:                | Deprecated           |

**LTS (Long-Term Support)**: Critical security patches backported for 6 months after a new major release.

---

## Reporting a Vulnerability

**We take security seriously.** If you discover a security issue, please disclose it responsibly.  

### How to Report  
- **Preferred**: Open a [GitHub Security Advisory](https://github.com/yourusername/nestjs-boilerplate/security/advisories) draft.  
- **Private Disclosure**: Email `security@alamjamal.me` with "[SECURITY]" in the subject.  

### What to Include  
- Detailed description of the vulnerability (steps to reproduce, code snippets, logs).  
- Environment details (OS, Node.js version, dependencies).  
- Suggested fix (optional but appreciated).  

### Response Process  
- **Acknowledgment**: Initial response within **3 business days**.  
- **Assessment**: Investigation and severity classification (low/medium/high/critical).  
- **Fix Timeline**:  
  - **Critical**: Patch within 72 hours.  
  - **High/Medium**: Patch in the next minor release.  
- **Public Disclosure**: After a fix is released, with credit to the reporter (if desired).  

---

## Security Considerations for This Boilerplate  
### **JWT Security**  
- Rotate `JWT_SECRET` in `.env` before deployment.  
- Set short expiration times (e.g., `JWT_EXPIRES_IN=15m` for access tokens).  

### **Redis Configuration**  
- Avoid exposing Redis to public networks. Use `REDIS_PASSWORD` if running in production.  

### **Database**  
- Never commit `.env` files with database credentials.  
- Use SSL/TLS for database connections in production.  

### **Dependencies**  
- Dependencies are pinned to specific versions in `package-lock.json`/`yarn.lock` for stability.  
- Run `npm audit`/`yarn audit` regularly and update dependencies promptly.  

---

**Thank you for improving the security of this project!**  
