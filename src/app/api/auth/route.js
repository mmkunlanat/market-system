import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const usersFile = join(process.cwd(), 'public', 'users.json');

async function readUsers() {
  try {
    const data = await readFile(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  try {
    await writeFile(usersFile, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { message: "กรุณากรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const users = await readUsers();
    const user = users.find(u =>
      (u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === normalizedEmail) &&
      u.password === cleanPassword
    );

    if (!user) {
      return Response.json(
        { message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ลบรหัสผ่านออกจาก response
    const { password: _, ...userWithoutPassword } = user;

    return Response.json(
      {
        message: "เข้าสู่ระบบสำเร็จ",
        token: Buffer.from(JSON.stringify(user)).toString('base64'),
        user: userWithoutPassword
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return Response.json(
      { message: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}
