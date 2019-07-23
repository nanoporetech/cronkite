import React, { useEffect, useState } from 'react'
import './Selector.scss'

const styles = {
    selectList: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
    },
}

export default React.forwardRef(function Selector(props, ref) {

    const [activeSelection, setActiveSelection] = useState({})
    const [reference, setReference] = useState([])

    useEffect(() => {
        try {
            const newReference = JSON.parse(props.selectList)
            if (newReference.length > reference.length) {
                setReference(newReference)
                const active = Object
                    .assign(
                        ...newReference.map(
                            selection =>
                            {
                                return ({
                                    [selection]: activeSelection[selection] === undefined
                                        ? true
                                        : activeSelection[selection]
                                })
                            }
                        )
                    )
                setActiveSelection(active)
            }
        } catch (ignore) {}

    }, [activeSelection, props.selectList, reference, reference.length])

    const selectHandler = label => {
        const active = Object.assign({}, activeSelection, {[label]: !activeSelection[label]})
        const newActiveSelection = Object.keys(active).filter(selection => active[selection])
        if (!newActiveSelection.length) return // Minimum one selected

        setActiveSelection(active)
        const newFilter = blob => {
            if (props.selector in blob) {
                return newActiveSelection.includes(blob[props.selector])
            }
            return true // Only filter if it has what you're looking for
        };

        document.querySelectorAll('.epi-filtered-datastream').forEach(stream => {
            stream.addFilter(props.selector, newFilter)
        })
    }

    return reference && reference.length
        ? (
            <div style={styles.selectList} ref={ref}>
                {
                    reference.sort().map(
                        (label) => {
                            return <div className={`selection-subject selection-${props.selector} ${(activeSelection || {})[label] ? 'selected': ''}`} key={label} onClick={() => selectHandler(label)}>{label}</div>
                        }
                    )
                }
            </div>
        )
        : null


})
