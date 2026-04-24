import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView } from 'react-native';
import GlassView from './GlassView';
import ApiService from '../services/api';
import { PanResponder } from 'react-native';

const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dy) > 10;
    },
    onPanResponderMove: (_, gesture) => {
        pan.current.y = gesture.dy;
    },
    onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 100) {
            onClose();
        }
    },
});

const DetailsModal = ({ visible, onClose, item }) => {
    const pan = useRef({ y: 0 });
    useEffect(() => {
        if (!item) return;

        ApiService.post('/api/interactions/event', {
            newsId: item.id,
            type: 'VIEW',
        });
    }, [item]);

    if (!item) return null;

    return (
        <View style={styles.overlay} {...panResponder.panHandlers}>
            <Modal visible={visible} animationType="fade" transparent>
                <View style={styles.overlay}>
                    <GlassView style={styles.modal}>
                        <ScrollView>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.content}>{item.content}</Text>
                        </ScrollView>
                    </GlassView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20,
    },
    modal: {
        maxHeight: '80%',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    content: {
        fontSize: 16,
    },
});

export default DetailsModal;