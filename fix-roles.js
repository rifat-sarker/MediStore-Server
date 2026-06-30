const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('USER_ROLE')) {
    content = content.replace(/import \{ USER_ROLE \}.*?;/g, 'import { Role } from "@prisma/client";');
    content = content.replace(/USER_ROLE\.customer/g, 'Role.CUSTOMER');
    content = content.replace(/USER_ROLE\.admin/g, 'Role.ADMIN');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
  }
}
