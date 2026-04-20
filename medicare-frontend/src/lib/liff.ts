declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    liff: any
  }
}

let initialized = false

export async function initLiff(liffId: string): Promise<void> {
  if (initialized) return
  if (typeof window === "undefined") return

  if (!window.liff) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script")
      script.src = "https://static.line-scdn.net/liff/edge/2/sdk.js"
      script.onload = () => resolve()
      script.onerror = () => reject(new Error("Failed to load LIFF SDK"))
      document.head.appendChild(script)
    })
  }

  await window.liff.init({ liffId })
  initialized = true
}

export function getLiffProfile(): Promise<{ userId: string; displayName: string; pictureUrl?: string }> {
  if (!window.liff?.isLoggedIn()) {
    throw new Error("LIFF not logged in")
  }
  return window.liff.getProfile()
}

export function liffLogin(redirectUri?: string): void {
  window.liff?.login({ redirectUri })
}

export function liffLogout(): void {
  window.liff?.logout()
  initialized = false
}

export function isLiffLoggedIn(): boolean {
  return typeof window !== "undefined" && window.liff?.isLoggedIn?.() === true
}
