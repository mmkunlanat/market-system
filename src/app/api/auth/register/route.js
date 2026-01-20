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
    throw error;
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, password } = await request.json();

    // Validation
    if (!name || !email || !phone || !password) {
      return Response.json(
        { message: "กรุณากรอกข้อมูลทั้งหมด" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const users = await readUsers();

    // ตรวจสอบว่า email ซ้ำหรือไม่
    if (users.some(u => u.email === email)) {
      return Response.json(
        { message: "อีเมลนี้มีการสมัครสมาชิกแล้ว" },
        { status: 400 }
      );
    }

    // สร้าง user object
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      username: email, // ใช้ emailเป็น username ด้วย
      phone,
      password, // ในการพัฒนาจริง ต้อง hash password
      role: 'user', // กำหนดสิทธิ์เริ่มต้นเป็น user
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    // บันทึก user
    users.push(newUser);
    await writeUsers(users);

    // ลบรหัสผ่านออกจาก response
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json(
      {
        message: "สมัครสมาชิกสำเร็จ",
        user: userWithoutPassword
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return Response.json(
      { message: "เกิดข้อผิดพลาด: " + error.message },
      { status: 500 }
    );
  }
}
