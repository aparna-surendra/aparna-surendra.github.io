####
#This code trains a deep-Q network to play Atari games with OpenAI's gym environment. 
#NOTE: This has been written for readability, not efficiency (it is not object-oriented, etc), and is included in the Reinforcement Learning primer here: aparna-surendra.github.io
####
import pandas as pd
import numpy as np
import tensorflow
import gym
import random
from collections import deque
from skimage import color, transform
import itertools
import keras
from keras import layers, backend #Can raise issues if not called explicitly
from keras.models import Sequential,load_model #Can raise issues if not called explicitly
from keras.callbacks import CSVLogger #Can raise issues if not called explicitly
from collections import deque
import pickle
import matplotlib.pyplot as plt
import csv

#Set environment-specific parameters
env = gym.make('PongDeterministic-v4') #Select Gym environment 
state_size = (84,84,4)
action_size = env.action_space.n

#Set hyperparameters
batch_size = 70
gamma = 0.99 #discount factor
l_rate = 0.00025 #learning rate
initial_epsilon = 1 #initial exploration
final_epsilon = 0.2
exploration_steps = 300000
saving_freq = 1  #in episodes
target_model_update_freq = 1000 #in timesteps
memory = deque(maxlen = 80000)
buffer_size = 20000
stats = []
total_reward_list = []

#Variables for interim checkpoints
target_val_list = []
csv_logger = CSVLogger('training.csv', append=True, separator=';')
stats = []

##FUNCTIONS########################
#Returns a processed frame 
def preprocess_image(observation):
    observation = observation[35:194]# crop
    observation = color.rgb2gray(observation) #convert to gray scale
    observation = transform.resize(observation,(84,84))
    return observation

#Selects action based on e-greedy policy
def get_action(model, history, epsilon):
    if random.random() < epsilon:
        action = env.action_space.sample()
    else:
        q_values = model.predict(history)
        action = np.argmax(q_values)
        action = int(action)
    return action

#Creates neural network 
def create_model():
    backend.set_image_dim_ordering('tf')
    model = Sequential()
    model.add(layers.Conv2D(32, (8, 8), strides=(4, 4), activation='relu',input_shape=state_size))
    model.add(layers.Conv2D(64, (4, 4), strides=(2, 2), activation='relu'))
    model.add(layers.Conv2D(64, (3, 3), strides=(1, 1), activation='relu'))
    model.add(layers.Flatten())
    model.add(layers.Dense(512, activation='relu'))
    model.add(layers.Dense(action_size))
    optimizer=keras.optimizers.Adam(lr=0.00025)
    model.compile(loss='mse',optimizer=optimizer)
    return model

#Sample minibatch from experience replay and conduct gradient descent 
def fit_model(model):
    target_val_list_temp = [] #Initialise to save target values
    history = np.zeros((batch_size,state_size[0], state_size[1], state_size[2])) #Initialise to save history
    target = []
    minibatch = random.sample(memory, batch_size) #Sample minibatch
    for counter, value in enumerate(minibatch):
        target_val = target_model.predict(value[0])
        target_val = target_val[0]
        target_val_list.append([e, np.amax(target_val)])
        if value[4]:
            target_val[value[1]] = value[3]
        else:
            target_val[value[1]] = value[3] + gamma*(np.amax(target_model.predict(value[2])))
        target.append(target_val)
        history[counter] = value[0]
    target = np.array(target)
    target_val_list.append(np.unique(target_val_list_temp))
    model.fit(history, target, batch_size = batch_size, verbose = 0, callbacks = [csv_logger])
    return model

#Updates target model with primary model weights 
def update_target_model(model, target_model):
    target_model.set_weights(model.get_weights())
    return target_model
################################

#Initialise values
buffer = 0 #initialise buffer
epsilon = initial_epsilon #initialise epsilon
avg_reward = -100 #Initialize to random negative number less than -20
t = 0  #time steps (0 initialise)
e = 0 #episodes (0 initialise)
model = load_model("weights-0404_1207AM.h5") #Standardise initial weights. Note: these weights only work for Pong. 
target_model = model 

#Fill experience replay memory to buffer
while buffer < buffer_size:
    observe = env.reset()
    observe,_,is_done,_= env.step(env.action_space.sample())
    state = preprocess_image(observe)
    history = np.stack((state, state, state, state), axis=2)
    history = np.reshape(history, (1, 84, 84, 4))
    while not is_done:
        buffer +=1
        action = env.action_space.sample()
        new_frame,reward,is_done,_= env.step(action)
        next_state = preprocess_image(new_frame)
        next_state = np.reshape([next_state], (1, 84, 84, 1))
        #Could move this into preprocess_image function
        next_history = np.append(next_state, history[:, :, :, :3], axis=3)
        memory.append([history, action, next_history, reward, is_done])
        history = next_history

#Begin training
while t < 1500000: 
    total_reward = 0 #Initialise reward counter
    observe = env.reset() #Initialise environment 
    observe,_,is_done,_= env.step(env.action_space.sample()) #Take a random action 
    state = preprocess_image(observe) #Preprocess the image 
    history = np.stack((state, state, state, state), axis=2) 
    history = np.reshape(history, (1, 84, 84, 4)) #Initialise the image sequence 
    while not is_done:
        action = get_action(model, history, epsilon) #Select action based on e-greedy policy
        new_frame, reward, is_done, _ = env.step(action) #Implement action
        next_state = preprocess_image(new_frame) 
        next_state = np.reshape([next_state], (1, 84, 84, 1))        
        next_history = np.append(next_state, history[:, :, :, :3], axis=3)
        memory.append([history, action, next_history, reward, is_done]) #Add transition to memory
        history = next_history #Set next state
        total_reward += reward #Update reward counter
        t += 1 #Update time-step counter
        epsilon -=((initial_epsilon - final_epsilon)/exploration_steps) #Update epsilon value
        epsilon = max(epsilon,final_epsilon) #Ensure epsilon is not less than minimum epsilon
        if t % 2 == 0: #Fit model every 2 steps to reduce computation
            model = fit_model(model) #Conduct gradient descent on minibatch 
        if t % target_model_update_freq == 0: #Fit every X steps
            target_model = update_target_model(model, target_model)
    e +=1
    total_reward_list.append(total_reward) #Append reward at end of every episode
    if e > 20:
        avg_reward = np.mean(total_reward_list[-20:]) #Calculate average reward over last 20 episodes
    else:
        avg_reward = -100
    stats.append([e, total_reward, t, epsilon, avg_reward])
    print ("EPISODE", e, total_reward, t, avg_reward)
    print ("SAVING")     #Periodic saving of interim values and variables
    model.save("weights-improvement-pong.h5")
    with open("stats-pong.file", "wb") as f: 
        pickle.dump(stats, f, pickle.HIGHEST_PROTOCOL)
    with open("target_val_file.csv", "w") as f:
        writer = csv.writer(f)
    if e % 50 == 0: 
        deque_slice = deque(itertools.islice(memory, 32000, 39999))
        with open("exp_replay.file", "wb") as f:
            pickle.dump(deque_slice, f, pickle.HIGHEST_PROTOCOL)


#Many thanks to the following on-line resources:
#   http://karpathy.github.io/2016/05/31/rl/
#   https://becominghuman.ai/lets-build-an-atari-ai-part-1-dqn-df57e8ff3b26
#   https://yanpanlau.github.io/2016/07/10/FlappyBird-Keras.html
#   http://www.danielslater.net/2016/03/deep-q-learning-pong-with-tensorflow.html
#   https://medium.com/@dhruvp/how-to-write-a-neural-network-to-play-pong-from-scratch-956b57d4f6e0