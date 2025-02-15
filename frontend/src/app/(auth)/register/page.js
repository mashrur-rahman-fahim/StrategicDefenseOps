"use client"

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useState } from 'react'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
        
    })

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [role_id, setRoleId] = useState(1) // Default to System Administrator
    const [parent_id, setParentId] = useState(null) // Optional, set to null initially
    const [errors, setErrors] = useState([])

    const roles = [
        { id: 1, name: "System Administrator" },
        { id: 2, name: "Operations Coordinator" },
        { id: 3, name: "Field Specialist" },
        { id: 4, name: "Mission Observer" },
    ]

    const submitForm = event => {
      
        event.preventDefault()

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role_id,
            parent_id,
            setErrors,
        });
       
        
    }

    return (
        <form onSubmit={submitForm}>
            {/* Name */}
            <div>
                <Label htmlFor="name">Name</Label>

                <Input
                    id="name"
                    type="text"
                    value={name}
                    className="block mt-1 w-full"
                    onChange={event => setName(event.target.value)}
                    required
                    autoFocus
                />

                <InputError messages={errors.name} className="mt-2" />
            </div>

            {/* Email Address */}
            <div className="mt-4">
                <Label htmlFor="email">Email</Label>

                <Input
                    id="email"
                    type="email"
                    value={email}
                    className="block mt-1 w-full"
                    onChange={event => setEmail(event.target.value)}
                    required
                />

                <InputError messages={errors.email} className="mt-2" />
            </div>

            {/* Password */}
            <div className="mt-4">
                <Label htmlFor="password">Password</Label>

                <Input
                    id="password"
                    type="password"
                    value={password}
                    className="block mt-1 w-full"
                    onChange={event => setPassword(event.target.value)}
                    required
                    autoComplete="new-password"
                />

                <InputError messages={errors.password} className="mt-2" />
            </div>

            {/* Confirm Password */}
            <div className="mt-4">
                <Label htmlFor="passwordConfirmation">
                    Confirm Password
                </Label>

                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    className="block mt-1 w-full"
                    onChange={event =>
                        setPasswordConfirmation(event.target.value)
                    }
                    required
                />

                <InputError
                    messages={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            {/* Role */}
            <div className="mt-4">
                <Label htmlFor="role_id">Role</Label>

                <select
                    id="role_id"
                    value={role_id}
                    onChange={event => setRoleId(Number(event.target.value))}
                    className="block mt-1 w-full"
                    required
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.id}>
                            {role.name}
                        </option>
                    ))}
                </select>

                <InputError messages={errors.role_id} className="mt-2" />
            </div>

            {/* Parent ID */}
            {/* Optional, if needed */}
            <div className="mt-4">
                <Label htmlFor="parent_id">Parent ID</Label>

                <Input
                    id="parent_id"
                    type="number"
                    value={parent_id || ''}
                    className="block mt-1 w-full"
                    onChange={event => setParentId(event.target.value)}
                />

                <InputError messages={errors.parent_id} className="mt-2" />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href="/login"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </Link>

                <Button className="ml-4">Register</Button>
            </div>
        </form>
    )
}

export default Page
