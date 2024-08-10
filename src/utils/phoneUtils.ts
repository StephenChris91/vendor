// utils/phoneUtils.ts

export function formatPhoneNumber(phone: string): string | null {
    // Remove any non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Check if it's already in international format
    if (digits.startsWith('234') && digits.length === 13) {
        return `+${digits}`;
    }

    // If it starts with '0', assume it's a Nigerian number and replace '0' with '234'
    if (digits.startsWith('0') && digits.length === 11) {
        return `+234${digits.slice(1)}`;
    }

    // If it's 10 digits, assume it's a Nigerian number without the leading '0'
    if (digits.length === 10) {
        return `+234${digits}`;
    }

    // If none of the above conditions are met, return null
    return null;
}