// src/file-operation.js

import fs from "node:fs/promises";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from 'node:url'; 

// Визначаємо абсолютний шлях до кореня проєкту
// 1. Отримуємо шлях до поточного файлу
const __filename = fileURLToPath(import.meta.url);
// 2. Отримуємо шлях до директорії 'src'
const __dirname = path.dirname(__filename); 
// 3. Коренева папка знаходиться на один рівень вище, ніж 'src'
const rootDir = path.join(__dirname, '..'); 

// !!! Завантажуємо змінні оточення, вказуючи абсолютний шлях до файлу .env !!!
dotenv.config({ path: path.join(rootDir, '.env') }); 

// Змінні зі .env
const fileName = process.env.FILENAME;
const content = process.env.FILE_CONTENT || "Текст за замовчуванням";

if (!fileName) {
    // Якщо dotenv не спрацював, тут має бути помилка.
    console.error("❌ Помилка: Змінна FILENAME не знайдена у файлі .env. Перевірте його наявність у корені проєкту.");
    process.exit(1);
}

// path.join(process.cwd(), fileName) тепер правильний, оскільки process.cwd() вказує на корінь проєкту
// завдяки запуску через "npm start"
const filePath = path.join(process.cwd(), fileName); 

async function runFileOperation() {
    console.log(`\n--- Робота з файлом '${fileName}' (dotenv та fs) ---`);
    
    try {
        // 1. Створення та запис файлу
        console.log(`Записуємо текст у файл: ${fileName}`);
        await fs.writeFile(filePath, content, { encoding: 'utf8' });
        console.log(`✅ Успішно записано: "${content}"`);

        // 2. Читання вмісту файлу
        console.log(`\nЧитаємо вміст файлу: ${fileName}`);
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        
        console.log(`✅ Отриманий вміст:`);
        console.log("-----------------------------------------");
        console.log(data);
        console.log("-----------------------------------------");
        
        // 3. Додатково: видалимо файл для чистоти
        await fs.unlink(filePath);
        console.log(`✅ Файл '${fileName}' успішно видалено.`);

    } catch (error) {
        // Обробка помилок файлової системи
        console.error(`❌ Сталася помилка при роботі з файлом: ${error.message}`);
    }
}

// Запускаємо функцію та ловимо критичні помилки, які можуть виникнути поза try/catch
runFileOperation().catch(error => {
    console.error(`\n⛔️ КРИТИЧНА ПОМИЛКА виконання файлової операції:`);
    console.error(error);
    process.exit(1);
});