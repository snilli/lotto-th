'use client'
import { Icon } from '@iconify/react'
import { Button, Divider, Input, Link } from '@nextui-org/react'

export default function Home() {
	return (
		<div className="flex items-center dark h-screen justify-center p-4">
			<div className="flex h-full w-full items-center justify-center">
				<div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
					<p className="pb-2 text-xl text-primary-foreground font-medium">Log In</p>
					<form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
						<Input label="Email Address" name="email" type="email" variant="bordered" />
						<Button
							color="primary"
							startContent={<Icon className="pointer-events-none text-2xl" icon="solar:letter-bold" />}
							type="submit"
						>
							Continue with Email
						</Button>
					</form>
					<div className="flex items-center gap-4 py-2">
						<Divider className="flex-1" />
						<p className="shrink-0 text-tiny text-default-500">OR</p>
						<Divider className="flex-1" />
					</div>
					<div className="flex flex-col gap-2">
						<Button startContent={<Icon icon="flat-color-icons:google" width={24} />} variant="flat">
							Continue with Google
						</Button>
						<Button
							startContent={<Icon className="text-default-500" icon="fe:github" width={24} />}
							variant="flat"
						>
							Continue with Github
						</Button>
					</div>
					<p className="text-primary-foreground text-center text-small">
						Need to create an account?&nbsp;
						<Link href="#" size="sm">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
