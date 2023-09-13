import styles from './styles.module.scss'

interface IButton {
    className?: string
    text: string
    onClick: () => void
    disabled?: boolean
    type?: string
}

const Button: React.FC<IButton> = ({
    className,
    text,
    onClick,
    disabled,
    type = 'primary',
}) => {
    return (
        <button
            className={`${styles.button} ${styles[type]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <span>{text}</span>
        </button>
    )
}

export default Button
