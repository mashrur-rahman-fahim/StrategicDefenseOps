import Link from 'next/link'

const NavLink = ({ active = false, children, ...props }) => {
    const baseStyles = 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out'
    const activeStyles = 'border-[#2d2d2d] text-[#2d2d2d] focus:border-[#2d2d2d]'
    const inactiveStyles = 'border-transparent text-gray-500 hover:text-[#2d2d2d] hover:border-gray-300 focus:text-[#2d2d2d] focus:border-gray-300'

    return (
        <Link
            {...props}
            className={`${baseStyles} ${active ? activeStyles : inactiveStyles}`}
        >
            {children}
        </Link>
    )
}

export default NavLink
