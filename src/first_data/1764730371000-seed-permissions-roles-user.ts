import { MigrationInterface, QueryRunner } from "typeorm";
import { ulid } from 'ulid';
import * as bcrypt from 'bcrypt';

export class SeedPermissionsRolesUser1764730371000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create Permissions
        const permissions = [
            { id: ulid(), name: 'view_users', slug: 'view-users', displayName: 'View Users', description: 'Can view users', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'create_users', slug: 'create-users', displayName: 'Create Users', description: 'Can create users', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'edit_users', slug: 'edit-users', displayName: 'Edit Users', description: 'Can edit users', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'delete_users', slug: 'delete-users', displayName: 'Delete Users', description: 'Can delete users', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'view_roles', slug: 'view-roles', displayName: 'View Roles', description: 'Can view roles', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'create_roles', slug: 'create-roles', displayName: 'Create Roles', description: 'Can create roles', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'edit_roles', slug: 'edit-roles', displayName: 'Edit Roles', description: 'Can edit roles', category: 'all_management', isActive: 1 },
            { id: ulid(), name: 'delete_roles', slug: 'delete-roles', displayName: 'Delete Roles', description: 'Can delete roles', category: 'all_management', isActive: 1 },
        ];

        for (const perm of permissions) {
            await queryRunner.query(`
                INSERT INTO permissions (id, name, slug, displayName, description, category, isActive)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [perm.id, perm.name, perm.slug, perm.displayName, perm.description, perm.category, perm.isActive]);
        }

        // 2. Create Roles
        const superAdminRoleId = ulid();
        const userRoleId = ulid();

        await queryRunner.query(`
            INSERT INTO roles (id, name, slug, description, color, sortOrder, isActive, isSystem)
            VALUES 
            (?, 'Super Admin', 'super-admin', 'Super Administrator with full access', 'red', 1, 1, 1),
            (?, 'User', 'user', 'Standard User', 'blue', 2, 1, 0)
        `, [superAdminRoleId, userRoleId]);

        // 3. Assign Permissions to Super Admin Role
        // Assign all created permissions to Super Admin
        for (const perm of permissions) {
            await queryRunner.query(`
                INSERT INTO role_permissions (roleId, permissionId)
                VALUES (?, ?)
            `, [superAdminRoleId, perm.id]);
        }

        // 4. Create User
        const userId = ulid();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash('Gi985042gih@', salt); // Default password: 

        await queryRunner.query(`
            INSERT INTO users (id, username, email, password, firstName, lastName, status, isEmailVerified)
            VALUES (?, 'devapps', 'devapps@example.com', ?, 'Gigih', 'Santoso', 'active', 1)
        `, [userId, hashedPassword]);

        // 5. Assign Role to User
        await queryRunner.query(`
            INSERT INTO user_roles (userId, roleId)
            VALUES (?, ?)
        `, [userId, superAdminRoleId]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Delete in reverse order
        await queryRunner.query(`DELETE FROM user_roles WHERE userId IN (SELECT id FROM users WHERE username = 'admin')`);
        await queryRunner.query(`DELETE FROM users WHERE username = 'admin'`);
        await queryRunner.query(`DELETE FROM role_permissions WHERE roleId IN (SELECT id FROM roles WHERE slug IN ('super-admin', 'user'))`);
        await queryRunner.query(`DELETE FROM roles WHERE slug IN ('super-admin', 'user')`);
        await queryRunner.query(`DELETE FROM permissions WHERE category = 'all_management'`);
    }
}
