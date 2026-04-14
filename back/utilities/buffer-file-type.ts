export function bufferFileType(fileData: Buffer): string {
    const allowedDataTypes: { [key: string]: string } = { '89504e470d0a1a0a': 'image/png', ffd8: 'image/jpg' };
    const magicNumbers = fileData.toString('hex', 0, 8);
    for (let key of Object.keys(allowedDataTypes)) {
        if (magicNumbers.startsWith(key)) return allowedDataTypes[key]!;
    }
    return 'invalid';
}
