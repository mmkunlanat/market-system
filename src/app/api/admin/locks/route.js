import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
    try {
        const locksFile = join(process.cwd(), 'public', 'locks.json');
        const data = await readFile(locksFile, 'utf-8');
        const locks = JSON.parse(data);
        return Response.json(locks);
    } catch (error) {
        return Response.json({ message: "Error reading locks" }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const { lockId, status } = await request.json();
        const locksFile = join(process.cwd(), 'public', 'locks.json');
        const data = await readFile(locksFile, 'utf-8');
        const locks = JSON.parse(data);

        const lockIndex = locks.findIndex(l => l._id === lockId);
        if (lockIndex === -1) {
            return Response.json({ message: "Lock not found" }, { status: 404 });
        }

        locks[lockIndex].status = status;
        await writeFile(locksFile, JSON.stringify(locks, null, 2), 'utf-8');

        return Response.json({ success: true, lock: locks[lockIndex] });
    } catch (error) {
        return Response.json({ message: "Error updating lock" }, { status: 500 });
    }
}
