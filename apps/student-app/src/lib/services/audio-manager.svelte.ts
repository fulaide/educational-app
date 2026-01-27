/**
 * AudioManager Service
 * Handles audio playback for text-to-speech functionality
 */

export interface AudioState {
	isPlaying: boolean
	isLoading: boolean
	currentUrl: string | null
	error: string | null
}

class AudioManagerClass {
	// Reactive state
	isPlaying = $state(false)
	isLoading = $state(false)
	error = $state<string | null>(null)

	// Private audio element
	private audio: HTMLAudioElement | null = null
	private currentUrl: string | null = null

	// API endpoint
	private apiUrl = '/api/math/speak'

	/**
	 * Initialize audio element if needed
	 */
	private initAudio(): HTMLAudioElement {
		if (!this.audio) {
			this.audio = new Audio()

			// Set up event listeners
			this.audio.addEventListener('playing', () => {
				this.isPlaying = true
				this.isLoading = false
			})

			this.audio.addEventListener('ended', () => {
				this.isPlaying = false
			})

			this.audio.addEventListener('pause', () => {
				this.isPlaying = false
			})

			this.audio.addEventListener('error', (e) => {
				console.error('Audio error:', e)
				this.isPlaying = false
				this.isLoading = false
				this.error = 'Audio konnte nicht abgespielt werden'
			})
		}

		return this.audio
	}

	/**
	 * Play audio from a URL
	 */
	async play(audioUrl: string): Promise<void> {
		this.error = null
		this.isLoading = true

		try {
			const audio = this.initAudio()

			// Stop current playback if any
			if (this.isPlaying) {
				audio.pause()
				audio.currentTime = 0
			}

			this.currentUrl = audioUrl
			audio.src = audioUrl

			await audio.play()
		} catch (err) {
			console.error('Error playing audio:', err)
			this.error = 'Audio konnte nicht abgespielt werden'
			this.isLoading = false
			this.isPlaying = false
		}
	}

	/**
	 * Speak text using the TTS API
	 */
	// async speakText(text: string, voice?: string): Promise<void> {
	// 	if (!text) return

	// 	this.error = null
	// 	this.isLoading = true

	// 	try {
	// 		const response = await fetch(this.apiUrl, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({ text, voice })
	// 		})

	// 		if (!response.ok) {
	// 			throw new Error(`TTS API error: ${response.status}`)
	// 		}

	// 		// Get audio blob
	// 		const audioBlob = await response.blob()
	// 		const audioUrl = URL.createObjectURL(audioBlob)

	// 		// Play the audio
	// 		await this.play(audioUrl)

	// 		// Clean up URL after playback
	// 		const audio = this.audio
	// 		if (audio) {
	// 			audio.addEventListener('ended', () => {
	// 				URL.revokeObjectURL(audioUrl)
	// 			}, { once: true })
	// 		}
	// 	} catch (err) {
	// 		console.error('Error speaking text:', err)
	// 		this.error = 'Sprachausgabe nicht verfügbar'
	// 		this.isLoading = false
	// 		this.isPlaying = false
	// 	}
	// }


	async speakText(text: string, voice?: string): Promise<void> {
  if (!text) return;

  this.error = null;
  this.isLoading = true;

  try {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({ text, voice })
    });

    // If server returns an error, read its body (often JSON/HTML)
    if (!response.ok) {
  const ct = response.headers.get('content-type') ?? '';
  const body = ct.includes('application/json')
    ? JSON.stringify(await response.json())
    : await response.text().catch(() => '');
  throw new Error(`TTS API error ${response.status}: ${body.slice(0, 400)}`);
}

    // Make sure it really is audio
    const ct = response.headers.get('content-type') ?? '';
    if (!ct.includes('audio')) {
      const body = await response.text().catch(() => '');
      throw new Error(`Expected audio, got "${ct}". Body: ${body.slice(0, 200)}`);
    }

    const audioBlob = await response.blob();
    console.log('TTS blob', { size: audioBlob.size, type: audioBlob.type });

    if (!audioBlob.size) throw new Error('TTS returned empty audio');

    // Force MIME if missing (some servers/streams forget content-type)
    const playableBlob = audioBlob.type
      ? audioBlob
      : new Blob([audioBlob], { type: 'audio/mpeg' });

    const audioUrl = URL.createObjectURL(playableBlob);

    await this.play(audioUrl);

    const audio = this.audio;
    if (audio) {
      audio.addEventListener(
        'ended',
        () => URL.revokeObjectURL(audioUrl),
        { once: true }
      );
    }
  } catch (err) {
    console.error('Error speaking text:', err);
    this.error = err instanceof Error ? err.message : 'Sprachausgabe nicht verfügbar';
    this.isLoading = false;
    this.isPlaying = false;
  }
}

	/**
	 * Stop current playback
	 */
	stop(): void {
		if (this.audio) {
			this.audio.pause()
			this.audio.currentTime = 0
		}
		this.isPlaying = false
		this.isLoading = false
	}

	/**
	 * Pause current playback
	 */
	pause(): void {
		if (this.audio && this.isPlaying) {
			this.audio.pause()
		}
	}

	/**
	 * Resume playback
	 */
	resume(): void {
		if (this.audio && !this.isPlaying) {
			this.audio.play().catch(console.error)
		}
	}

	/**
	 * Toggle playback
	 */
	toggle(): void {
		if (this.isPlaying) {
			this.pause()
		} else {
			this.resume()
		}
	}

	/**
	 * Set volume (0.0 to 1.0)
	 */
	setVolume(volume: number): void {
		if (this.audio) {
			this.audio.volume = Math.max(0, Math.min(1, volume))
		}
	}

	/**
	 * Get current volume
	 */
	getVolume(): number {
		return this.audio?.volume ?? 1
	}

	/**
	 * Check if TTS is available
	 */
	async checkAvailability(): Promise<boolean> {
		try {
			// Simple ping to check if the API is available
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: 'test' })
			})

			// 503 means not configured, which is expected if no API key
			return response.ok || response.status !== 503
		} catch {
			return false
		}
	}

	/**
	 * Clean up resources
	 */
	destroy(): void {
		this.stop()
		if (this.audio) {
			this.audio.src = ''
			this.audio = null
		}
		this.currentUrl = null
	}
}

// Create singleton instance
export const audioManager = new AudioManagerClass()
