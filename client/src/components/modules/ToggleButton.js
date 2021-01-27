import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "./ToggleButton.css";

const CheckedIcon = () => <>🌜</>;
const UncheckedIcon = () => <>🌞</>;

/**
 * Credits: https://webomnizz.com/how-to-create-a-toggle-switch-button-in-react/
 * 
 * @param callback callback function 
 */
const ToggleButton = ( props ) => {
    let theme = localStorage.getItem('theme') == "dark" ? true : false;

    const [toggle, setToggle] = useState(theme);
    const { defaultChecked, onChange, disabled, className } = props;

    useEffect(() => {
        if (theme) {
            setToggle(theme);
            document.body.classList.add("dark");
            document.body.classList.remove("light");
            localStorage.setItem('theme', "dark");
        }
        // triggerToggle();
    }, [theme]);

    const triggerToggle = () => {
        if ( disabled ) {
            return;
        }

        if (toggle) {
            document.body.classList.add("light");
            document.body.classList.remove("dark");
            localStorage.setItem('theme', "light");

          } else {
            document.body.classList.add("dark");
            document.body.classList.remove("light");
            localStorage.setItem('theme', "dark");

        }

        setToggle(!toggle);

        // if ( typeof onChange === 'function' ) {
        //     onChange(!toggle);
        // }
    }

    const getIcon = (type) => {
        const { icons } = props;
        if ( ! icons ) {
            return null;
        }

        return icons[type] === undefined ?
            ToggleButton.defaultProps.icons[type] :
            icons[type];
    }

    const toggleClasses = classNames('wrg-toggle', {
        'wrg-toggle--checked': toggle,
        'wrg-toggle--disabled': disabled
    }, className);

    return (
        <div 
            onClick={triggerToggle} 
            className={toggleClasses}>
            <div className="wrg-toggle-container">
                <div className="wrg-toggle-check">
                    <span>{ getIcon('checked') }</span>
                </div>
                <div className="wrg-toggle-uncheck">
                    <span>{ getIcon('unchecked') }</span>
                </div>
            </div>
            <div className="wrg-toggle-circle"></div>
            <input type="checkbox" aria-label="Toggle Button" className="wrg-toggle-input" />
        </div>
    );
}

ToggleButton.defaultProps = {
    icons: {
        checked: <CheckedIcon />, 
        unchecked: <UncheckedIcon />
    }
};

ToggleButton.propTypes = {
    disabled: PropTypes.bool,
    defaultChecked: PropTypes.bool,
    className: PropTypes.string,
    onChange: PropTypes.func,
    icons: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            checked: PropTypes.node,
            unchecked: PropTypes.node
        })
    ])
};

export default ToggleButton;