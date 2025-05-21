export function generateRandomEmail(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // four-digit number between 1000-9999
    return `jenny${randomNumber}@gmail.com`;
}