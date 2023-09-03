<template>
<div class="day-gas-mask">
  <div class="day-gas-container gas-page-bg">
    <div class="top-bag">
      <div class="top-header">
        <top-menu
          @t-date-change="tDateChange"
          :date-picker-show="false"
          title="日气量交割"
        ></top-menu>
      </div>
      <div class="top-title">
        <div class="top-con">
          <el-form
            class="tab-content"
            :model="planForm"
            ref="planForm"
            status-icon
            :rules="rules"
            label-width="180px"
          >
            <el-row :gutter="0">
              <el-col :lg="4" :xl="3" class="title">日气量计划</el-col>
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">日期</span>
                  <el-date-picker
                    v-model="planForm.date"
                    format="yyyy/MM/dd"
                    type="date"
                    @change="changePlanForm"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                </div>
              </el-col>
              <el-col :lg="8" :xl="5">
                <div class="block">
                  <span class="plan-search-label">供应商</span>
                  <el-cascader
                    :options="listSupplierList"
                    :props="{
                      
                      checkStrictly: true,
                      value: 'linfnr',
                      label: 'linfnrTxt',
                      children: '',
                    }"
                    v-model="planForm.changeOptions"
                    @change="handleChange"
                    collapse-tags
                    ref="cascaderAddr"
                    clearable
                  ></el-cascader>
                </div>
              </el-col>
            </el-row>
            <div class="gas-content">
              <div class="plan-list">
                <div class="plan-list-title">供应商：</div>
                <div class="list-com supplier-list">
                  <div
                    class="list-item"
                    v-for="(item, index) in getChangedSupplier"
                    :key="index+'l'"
                  >
                    <el-form-item :label="item.linfnrTxt">
                      <el-input
                        v-model="item.gasNum"
                        placeholder="请输入日交割量"
                      ></el-input>
                      <span class="custom-unit">万方</span>
                    </el-form-item>
                  </div>
                </div>
              </div>
              <div class="plan-list">
                <div class="plan-list-title">用气客户：</div>
                <div class="list-com supplier-list user-list">
                  <div
                    class="list-item"
                    v-for="(item, index) in planUserdata"
                    :key="index+'m'"
                  >
                    <el-form-item :label="item.compCodeTxt">
                      <el-input
                        v-model="item.gasNum"
                        placeholder="请输入日交割量"
                      ></el-input>
                      <div class="custom-tooltip" v-show="item.status == 1">
                        <!-- <i class="el-icon-warning-outline"></i> -->
                        <div class="tooltip">
                          已确认
                          <div class="popper__arrow"></div>
                        </div>
                      </div>
                      <span class="custom-unit">万方</span>
                    </el-form-item>
                  </div>
                </div>
              </div>

              <!-- 价格设置 -->
              <div class="price-tag">
                <el-button class="setPrice" @click="setPrice" >
                  <i class="el-icon-setting"></i> 价格设置</el-button
                >
                <div class="tip-balance">
                  <div class="tip-balance-con" @mouseenter="tipContentShowB" @mouseleave="tipContentHideB">
                      <img src="./assets/tip.png" alt="">
                  </div>
                  
                  <div class="tip-number">{{ tipPriceData.length }}</div>
                  <div class="tip-content" @mouseenter="tipContentShowB" @mouseleave="tipContentHideB"  :class="{'tip-content-show':tipContentShow}" v-if="tipPriceData.length > 0">
                    <div class="solid-core"></div>
                    <div class="hollow"></div>
                    <div class="tip-list">
                      <div class="tip-icon"><i class="el-icon-warning-outline"></i></div>
                      <div
                        class="tip-list-item"
                        v-for="(item, index) in tipPriceData"
                        :key="index+'k1'"
                      >
                        <div class="supplier-title">
                          <span v-if="item.type=='0'">供应商：</span>
                          <span v-if="item.type=='1'">用气客户：</span>
                          {{ item.codeTxt }}
                        </div>
                        <div class="balance">
                          余额
                          <span class="balance-number">{{
                            item.balancePrice
                          }}</span>
                          万元，预计可用{{ item.scheduledTime }}天，请及时充值。
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="planSubmit">
                <el-button class="submitBtn" type="primary" @click="planCommit"
                   >提交</el-button
                >
                <el-button class="resetBtn" @click="resetBtn">重置</el-button>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 设置价格弹框 -->
    <el-dialog title="价格设置" :visible.sync="dialogFormVisible">
      <div class="set-price">
        <div class="title">供应商：</div>
        <div class="list-com price-list">
          <!-- <div  > -->
          <div
            class="list-item"
            v-for="(item, index) in getSuppliersList"
            :key="index+'j'"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
            @click="saveLinfrsStatus(item, index)"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="setGPrice(item)">设置</span>
          </div>
          <!-- </div> -->
        </div>
        <div class="title">管输方：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getPipelinesList"
            :key="index +'w'"
            @click="savePipelineStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="GSetGPrice(item)">设置</span>
          </div>
        </div>
        <div class="title">用户客户：</div>
        <div class="list-com price-list">
          <div
            class="list-item"
            v-for="(item, index) in getCompVosList"
            :key="index+'h'"
            @click="saveCompStatus(item, index)"
            :class="{
              isChecked: item.status == '1',
              'list-itemC': item.status == '1',
            }"
          >
            <div class="left">
              <i class="el-icon-success" v-if="item.status == '1'"></i>
              <img
                src="@/assets/img/uncheced.png"
                class="uncheced"
                v-else
                alt="logo"
              />
              <label >{{ item.name }}</label>
            </div>
            <span class="set-btn" @click.stop="userSetGPrice(item)">设置</span>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false"
          >确 1定</el-button
        > -->
      </div>
    </el-dialog>
    <!-- 供应商设置 -->
    <el-dialog
      title="价格设置  /  供应商设置"
      @close="dialogFormVisible1 = false"
      :visible.sync="dialogFormVisible1"
      :key="editTimer"
    >
      <div class="set-detail">
        <!-- {{ this.getGPriceItem }} -->
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGPriceItem.name }}</span>
            <span class="com-code">编号：{{ getGPriceItem.code }}</span>
          </div>
          <el-button type="info" class="submitBtn" plain @click="lifnrsExport"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClickGYS"
            class="custom-tab"
          >
          
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
              
              
                <div
                  class="content-item"
                  v-for="(item1, index) in getGPriceItemData"
                  :key="index +'g'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input v-model="item1.gasPrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 +'er'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item :label="'阶梯' + (index1 + 1) + '：'">
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input v-model="item2.price"></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span class="del-step" @click="delStep(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>

                    <!-- </el-form> -->
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickedgsf(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions"
                      format="yyyy/MM/dd"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceB(item1,index)">删除</div>
                </div>
              <div class="addprice-btn" @click="addPriceTimePhas">
               添加时间阶段
              </div>
                <!-- <el-form-item> -->
                <div class="com-btn">
                  <el-button @click="gysBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="nextBtnClicked('ruleForm')"
                    >保存</el-button
                  >
                </div>
                <!-- </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：">
                    <el-input
                      v-model="setSupplierPriceyD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setSupplierPriceyD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeCompForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="gysBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setSupplierPricey('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 用气客户设置 -->
    <el-dialog
      title="价格设置  /  用气客户设置"
      :visible.sync="dialogFormVisible2"
      :key="editTimerUser"
    >
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getuserchangeData.name }}</span>
            <span class="com-code">编号：{{ getuserchangeData.code }}</span>
          </div>
          <el-button
            type="info"
            class="submitBtn"
            plain
            @click="compsExportPrice"
            ><i class="el-icon-upload2"></i>年度销售单价列表</el-button
          >
        </div>
        <div class="detail-content">
          <el-tabs
            v-model="activeNameUser"
            @tab-click="handleClickkh"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
              
                <div
                  class="content-item"
                  v-for="(item1, index) in getlistCompPriceData"
                  :key="index +'rt'"
                >
                  <el-form-item label="计价方式：" label-width="100px">
                    <el-radio-group v-model="item1.priceType">
                      <el-radio label="1">单一计价</el-radio>
                      <el-radio label="2">阶梯计价</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <template v-if="item1.priceType == 1" class="">
                    <el-form-item label="价格：" class="price-custom">
                      <el-input v-model="item1.gasPrice"></el-input>
                      <span class="custom-unit">元/方</span>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div
                      v-for="(item2, index1) in item1.priceDesc"
                      :key="index1 +'f'"
                      class="step-input"
                    >
                      <el-row>
                        <el-col :span="11">
                          <el-form-item :label="'阶梯' + (index1 + 1) + '：'">
                            <el-input
                              :disabled="item2.num === '超量'"
                              v-model="item2.num"
                            ></el-input>
                            <span class="custom-label">气量</span>
                            <span class="custom-unit">万方</span>
                          </el-form-item>
                        </el-col>
                        <el-col :span="11">
                          <el-form-item
                            label=""
                            label-width="20px"
                            :rules="[
                              {
                                required: true,
                                message: '请输入阶梯单价',
                                trigger: 'blur',
                              },
                            ]"
                          >
                            <el-input v-model="item2.price"></el-input>
                            <span class="custom-label">单价</span>
                            <span class="custom-unit">元/方</span>
                          </el-form-item>
                        </el-col>
                        <el-col
                          :span="2"
                          v-show="item1.priceDesc.length - 2 === index1"
                        >
                          <span
                            class="del-step"
                            @click="delStepUser(index1, item2)"
                            >X</span
                          >
                        </el-col>
                      </el-row>
                    </div>
                    <el-button
                      class="add-step"
                      type="primary"
                      @click="addBtnClickeduser(item1)"
                      >添加阶梯</el-button
                    >
                  </template>
                  <el-form-item label="生效时间" class="date-picker-change">
                    <el-date-picker
                    format="yyyy/MM/dd"
                      v-model="item1.shoArr"
                      :picker-options="pickerSpaceOptions"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      class="date-picker"
                      
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="del-price-btn" @click="delPriceUser(item1,index)">删除</div>
                </div>
                
                <div class="addprice-btn" @click="addPriceTimePhasUser">
               添加时间阶段
              </div>
                <div class="com-btn">
                  <el-button @click="userBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="saveCompPrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：" prop="name">
                    <el-input v-model="setCompPriceYD.prepaidPrice"></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：" prop="date1">
                    <el-date-picker
                      v-model="setCompPriceYD.time"
                      type="date"
                      placeholder="选择日期"
                      @change="changeUserForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="userBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setCompPriceY('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <!-- 管输方 -->
    <el-dialog title="价格设置  /  管输方" :visible.sync="dialogFormVisible3">
      <div class="set-detail">
        <div class="detail-title">
          <div class="title-left">
            <span class="com-name">{{ getGSFitem.name }}</span>
            <span class="com-code">编号：{{ getGSFitem.code }}</span>
          </div>
        </div>
        <div class="detail-content loser-detail">
          <el-tabs
            v-model="activeNameGSF"
            @tab-click="handleClickGSF"
            class="custom-tab"
          >
            <el-tab-pane label="采购单价" name="first">
              <el-form
                class="tab-content"
                :model="ruleForm"
                ref="ruleForm"
                status-icon
                :rules="rules"
                label-width="100px"
              >
                <div
                  class="loser-top"
                  
                >
                  上载点：{{ getPipelineUpGasPlace}}
                </div>
                <div
                  class="loser-list"
                  v-for="(item, index) in getlistPipelinePriceData"
                  :key="index+'q'"
                >
                  <div class="list-top">
                    <div class="list-top-com">
                      下载点：{{ item.downGasPlace }}
                      <div class="custom-tooltip">
                        <i class="el-icon-warning-outline"></i>
                        <!-- <div class="tooltip">
                          提示语
                          <div class="popper__arrow"></div>
                        </div> -->
                      </div>
                    </div>
                    <div class="list-top-com">客户：{{ item.compCodeTxt }}</div>
                  </div>
                  <el-form-item label="管输价格：">
                    <el-input v-model="item.gasPrice"></el-input>
                    <span class="custom-unit">元/方</span>
                  </el-form-item>
                </div>
                <div class="com-btn">
                  <el-button @click="gsfBackBtn">返回</el-button>
                  <el-button
                    class="save-btn"
                    type="primary"
                    @click="savePipelinePrice('ruleForm')"
                    >保存</el-button
                  >
                </div>
                <!-- </el-form-item> -->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="预付费用" name="second">
              <div class="tab-content">
                <el-form ref="form" :model="form" label-width="100px">
                  <el-form-item label="预付费用：">
                    <el-input
                      v-model="setPipelinePriceYD.prepaidPrice"
                    ></el-input>
                    <span class="custom-unit">万元</span>
                  </el-form-item>
                  <el-form-item label="预付时间：">
                    <el-date-picker
                      v-model="setPipelinePriceYD.time"
                      type="date"
                      placeholder="选择日期"
                       @change="changePipelineForm"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <div class="com-btn">
                    <el-button @click="comBackBtn">返回</el-button>
                    <el-button
                      class="save-btn"
                      type="primary"
                      @click="setPipelinePriceY('form')"
                      >保存</el-button
                    >
                  </div>
                </el-form>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
    <div class="tabel-container">
      <div class="table-search">
        <!-- <span>气量日报表</span> -->
        <el-row :gutter="0">
          <el-col :lg="3" :xl="3" class="title">气量日报表</el-col>
          <el-col :lg="6" :xl="6" class="day-table-date">
            <div class="block">
              <span class="demonstration">日期：</span>
              <el-date-picker
               
                v-model="gasReportDate"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy/MM/dd"
                placeholder="选择日期时间"
                @change="ReportListdateChange"
                class="table-date"
              >
              </el-date-picker>
            </div>
          </el-col>
          <el-col :lg="7" :xl="6">
            <div class="block">
              <span class="demonstration">供应商：</span>
              <el-cascader
                :options="listSupplierList"
                :props="{
                  checkStrictly: true,
                  value: 'linfnr',
                  label: 'linfnrTxt',
                  children: '',
                }"
                v-model="reportChangeOptions"
                @change="handleChange1"
                clearable
              ></el-cascader>
            </div>
          </el-col>
          <el-col :lg="6" :xl="6">
            <div class="block">
              <span class="demonstration">数据：</span>
              <el-cascader
                :options="repotTypeOptions"
                :props="{ checkStrictly: true }"
                clearable
                v-model="reportTypeChannge"
                @change="changeRepotTypeOptions"
              ></el-cascader>
            </div>
          </el-col>
          <el-col :lg="2" :xl="2">
            <div class="block derive-btn">
              <el-button
                type="info"
                class="submitBtn-day"
                plain
                @click="exportExcel1"
                ><i class="el-icon-upload2"></i>导出</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="table-unit">单位：
        <!-- 价格 -->
        <span v-if="reportTypeM =='02'">元/方</span>
        <!-- 气量 -->
        <span v-if="reportTypeM =='03'">万方</span>
        <!-- 费用 -->
        <span v-if="reportTypeM =='01'">万元</span>
      </div>
      <el-table
        stripe
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        :data="getPriceReportData.dataList"
        header-row-class-name="custom-table-header"
        header-cell-class-name="custom-table-header-cell"
        cell-class-name="custom-table-cell"
        
        class="custom-table-r"
      >
        <!-- 动态生成列 -->
        <el-table-column
          v-for="(item, index) in getPriceReportData.theadList"
          :key="'a' + index"
          :label="item.label"
          :prop="item.prop"
        >
          <el-table-column
            v-for="(el, idx) in item.children"
            :key="'b' + idx"
            :label="el.label"
            :prop="el.prop"
          >
            <template slot-scope="{ row }">
              {{ row[el.prop] || "-" }}
            </template>
            <el-table-column
              v-for="(m, i) in el.children"
              :key="'c' + i"
              :label="m.label"
              :prop="m.prop"
            >
              <template slot-scope="{ row }">
                {{ row[m.prop] || "-" }}
              </template>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <!-- 动态生成列结束 -->
      </el-table>
    </div>
  </div>
</div>
  
</template>

<script>
import api from "/src/http/api";
import topMenu from "../../components/topMenu/topMenu";
import exportApi from "/src/components/export/export";
export default {
  name: "PurchaseAnalysiss",
  mixins: [exportApi],
  components: {
    topMenu,
  },
  props: {},
  data() {
    return {
      reportChangeOptions:'',
      downloadPoint:[
           
      ],
      editTimer: 3, //编辑弹框key
      editTimerUser:2,
      getuserchangeData: "", //获取用气客户当前选项
      arr: [
        { code: "XA037", name: "蚌埠新奥", status: "01" },
        { code: "XA037", name: "蚌埠新奥2", status: "02" },
      ],
      planUserdata: [], //日期量计划获取用户客户
      getCompVosList: [], //A获取供应商数据
      getSuppliersList: [], //获取用气客户数据
      getPipelinesList: [], //获取管输方数据
      tipcontent: "地址定位",
      value1: "",
      input: "",
      dialogFormVisible: false, //设置价格弹框显示
      dialogFormVisible1: false, //供应商弹框显示
      dialogFormVisible2: false, //用气客户弹框显示
      dialogFormVisible3: false, //管输方弹框显示
      activeNameGSF: "first", //g管输方tab
      activeName: "first", //供应商tab
      activeNameUser: "first", //用气客户tab
      listSupplierList: [],
      getChangedSupplier: [], //已选择的供应商
      getArr: [], //已获取供应商编码
      getEntysList: [], //获取供应商客户等信息
      isChecked: true,
      gasReportDate: [], //日报表日期
      planForm: {
        date: "",
        changeOptions: "",
      },
      reportTypeM:'',
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "1",
        desc: "",
        arrData: [],
      },

      rules: {
        date1: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        name: [{ required: true, message: "请输入年龄", trigger: "blur" }],
      },
      changeOptions: [],
      repotTypeOptions: [
        {
          value: "01",
          label: "费用",
        },
        {
          value: "02",
          label: "价格",
        },
        {
          value: "03",
          label: "气量",
        },
      ],
      tipContentShow:false,
      options: [],
      startTime: "",
      gasReportStart: "",
      gasReportEnd: "",
      radio: false,
      activedIndex: "1",
      tagsConfig: [],
      flag: true,
      comOptions: "",
      // curComCode: "", //获取公司code
      gasPriceRportchange: "", //获取日报表查询选择的供应商
      getGPriceItem: "", //要设置价格的供应商
      getGSFitem: "", //要设置价格的管输
      getGPriceItemData: [], //获取供应商
      getlistCompPriceData: [], //获取公司数据
      getlistPipelinePriceData: [], //获取管输价格
      pickerSpaceOptions: {
        disabledDate(time) {
          let now = new Date();
          let nowMonth = now.getMonth(); //当前月
          let nowYear = now.getFullYear(); //当前年
          //本月的开始时间
          let monthStartDate = new Date(nowYear, nowMonth, 1);
          //本月的结束时间
          let monthEndDate = new Date(nowYear, nowMonth + 1, 0);

          return (
            time.getTime() < monthStartDate || time.getTime() > monthEndDate
          );
        },
      },
     PminDate: null,
     PmaxDate: null,
     day30: 30 * 24 * 3600 * 1000,
     // 日期使用
     pickerOptions: {
        onPick: ({  minDate }) => {
         if (minDate && this.PminDate) {
           this.PminDate = null;
         } else if (minDate) {
           this.PminDate = minDate.getTime();
         }
       },
       disabledDate: (time) => {
         if (this.PminDate) {
           return (time.getTime() > (this.PminDate + this.day30)) || (time.getTime() < (this.PminDate - this.day30));
         }
         return false;
       }
     },
      tipPriceData: [], //余额提醒数据
      compPriceListData: "", //公司预付费用列表数据
      supplierPriceListData: "", //供应商预付费用列表数据
      pipelinePriceListData: "", //管输预付费用列表数据
      // 设置供应商预付费用
      setSupplierPriceyD: {
        prepaidPrice: "",
        time: "",
      },
      // 公司预付费用设置
      setCompPriceYD: {
        prepaidPrice: "",
        time: "",
      },
      setPipelinePriceYD: {
        prepaidPrice: "",
        time: "",
      },
      getPriceReportData: "", //价格日报表数据
      getPipelineUpGasPlace: "",
      getRepotTypeOptions: "", //获取当前选择的报表类型
      reportTypeChannge:''
    };
  },
  computed: {
    curComCode: function () {
        return this.$store.getters.curCom
      },
      curComCodeName: function () {
      return this.$store.getters.curComName
    }
  },
  watch: {
    curComCode: {
        immediate: true,
        handler: function (n, o) {
          if(n && o) {
            this.getData();
          }
        }
      }

  },
  created() {
    this.getPlanList();
    this.listSupplier();
    this.planForm.date = Date.now();
    this.gasReportDate[0] = new Date().setMonth((new Date().getMonth()-1));
    this.gasReportDate[1] = Date.now();
    this.comOptions = this.$store.getters["companyList"];
    // this.curComCode = this.$store.getters["curCom"];
    if (this.planForm.changeOptions) {
      this.geulistComps();
    }
  },
 
  async mounted() {
    this.getPlanList();
    this.tipPriceE();
  },
  beforeDestroy() {
    // window.removeEventListener('resize');
  },
  methods: {
    getData(){
      this.listSupplier();
      this.getPlanList();
      this.tipPriceE();
    },
    tipContentShowB(){
       this.tipContentShow=true
    },
    tipContentHideB(){
    this.tipContentShow = false
    },
    addPriceTimePhasUser(){
    
      let asd = {
        code: this.getuserchangeData.code,
        codeTxt: "",
        gasPrice: "",
        id:'' ,
        priceDesc: [
          {
            num: "",
            price: "",
          },{
            num: "超量",
            price: "",
          }

        ],
        shoArr:[],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: ""
      }
      this.getlistCompPriceData.push(asd)
      this.getlistCompPriceData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            // item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
    },
    addPriceTimePhas(){
      let asd = {
        code: this.getGPriceItem.code,
        codeTxt: "",
        gasPrice: "",
        id:'' ,
        priceDesc: [
          {
            num: "",
            price: "",
          },{
            num: "超量",
            price: "",
          }

        ],
        shoArr:[],
        priceType: "1",
        status: "",
        time: null,
        timeSlot: "",
        year: ""
      }
      this.getGPriceItemData.push(asd)
      this.getGPriceItemData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            // item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
    },
   
    exportExcel1() {
      // this.gasPrepaidReport()  
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReport();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportExport();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasDayReport();
      }
    },
    // 价格日报表导出
    gasPriceRportExport() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        lifnr: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasPriceRportExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 费用日报表导出
    gasPrepaidReport() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        supplierCode: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasPrepaidReport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 气量报表导出
    gasDayReport() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.gasPriceRportchange[0],
      };
      api.dayGasD.gasDayReport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    //   保存供应商状态
    saveLinfrsStatus(val, index) {
      if (val.status == "1") {
        this.getSuppliersList[index].status = "2";
      } else {
        this.getSuppliersList[index].status = "1";
      }
      let data = {
        code: val.code,
        // status: 1,
        status: this.getSuppliersList[index].status,
      };
      api.dayGasD.saveLinfrsStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 保存公司状态
    saveCompStatus(val, index) {
      if (val.status == "1") {
        this.getCompVosList[index].status = "2";
      } else {
        this.getCompVosList[index].status = "1";
      }
      let data = {
        companycode: val.code,
        // companycode: "180032",
        status: this.getCompVosList[index].status,
      };
      api.dayGasD.saveCompStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    // 管输方状态保存
    savePipelineStatus(val, index) {
      if (val.status == "1") {
        this.getPipelinesList[index].status = "2";
      } else {
        this.getPipelinesList[index].status = "1";
      }
      let data = {
        pipelineCode: val.code,
        status: this.getPipelinesList[index].status,
      };
      api.dayGasD.savePipelineStatus(data).then((res) => {
        if (res) {
          this.$message({
            message: "状态设置成功",
            type: "success",
            duration: 1000,
          });
        }
      });
    },
    changePlanForm() {
      this.tipPriceE();
      if (this.planForm.changeOptions) {
        this.geulistComps();
      }
    },
    getFormatTime: function (timestamp) {
      let date = new Date(timestamp);
      let yyyy = date.getFullYear();
      let mm =
        date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return yyyy + "-" + mm + "-" + dd;
    },
    getPlanList() {
      api.dayGasD.getEntys().then((res) => {
        if (res) {
          this.getEntysList = res;

          (this.getCompVosList =
            this.getEntysList.length > 0 ? this.getEntysList[0].companys : []), //A获取供应商数据
            (this.getSuppliersList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].suppliers
                : []), //获取用气客户数据
            (this.getPipelinesList =
              this.getEntysList.length > 0
                ? this.getEntysList[0].pipelines
                : []) //获取管输方数据
        }
      });
    },
    tDateChange: function (date) {
      this.startTime = new Date(date).getTime() / 1000;
      this.endTime = this.startTime + 24 * 60 * 60;
      //   this.getData()
    },
    // 获取日气量计划 选择的供应商
    handleChange(e) {
      // 已选择供应商数据
      if (e.length != 0) {
        this.getChangedSupplier = this.getArrEqual(this.listSupplierList, e);
      }
      this.geulistComps();
    },
    // 获取日气量报表 选择的供应商
    handleChange1(e) {
      //   获取日报表查询选择的供应商
      this.gasPriceRportchange = e;
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReportList();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportList();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasReportList();
      }
    },
    // 获取已选供应商
    getArrEqual(arr1, arr2) {
      let newArr = [];
      for (let i = 0; i < arr1.length; i++) {
          if (arr1[i].linfnr === arr2[0]) {
            newArr.push(arr1[i]);
          }
      }
      return newArr;
    },
    // 供应商删除时间价格阶段
    delPriceB(item,index){
      this.getGPriceItemData.forEach((element,index1) => {
        if(index ==index1){
          this.getGPriceItemData.splice(index, 1);
        }
      });


    },
    delPriceUser(item,index){
      this.getlistCompPriceData.forEach((element,index1) => {
        if(index ==index1){
          this.getlistCompPriceData.splice(index, 1);
        }
      });


    },
    addBtnClickedgsf(val) {
      this.getGPriceItemData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
          // item1.priceDesc.push(asd);
        }
      });
    },

    addBtnClickeduser(val) {
      this.getlistCompPriceData.forEach((item1) => {
        if (item1.id == val.id) {
          let asd = {
            num: "",
            price: "",
          };
          item1.priceDesc.splice(item1.priceDesc.length - 2, 0, asd);
        }
      });
    },
    // 删除阶梯
    delStep(dd) {
      this.getGPriceItemData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
      
    },
    delStepUser(dd) {
      this.getlistCompPriceData.forEach((item) => {
        item.priceDesc.forEach((val, index) => {
          if (dd == index) {
            item.priceDesc.splice(index, 1);
          }
        });
      });
      
    },
    // 供应商tab栏
    handleClickGYS(tab) {
      if (tab.name == "first") {
        this.listLinrsPrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.supplierPriceList();
      }
    },
    // 用气客户tab栏
    handleClickkh(tab) {
      if (tab.name == "first") {
        this.getlistCompPrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.compPriceList();
      }
    },
    // 管输方tab栏
    handleClickGSF(tab) {
      if (tab.name == "first") {
        this.getlistPipelinePrice();
      } else if (tab.name === "second") {
        // 供应商预付费用list
        this.pipelinePriceList();
      }
    },
    setPrice() {
      this.dialogFormVisible = true;
    },
    // 供应商设置弹框
    setGPrice(val) {
      this.getGPriceItem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = true;
      this.activeName= "first"
      this.listLinrsPrice();
      this.editTimer++;
    },
    // 管输方
    GSetGPrice(val) {
      this.getGSFitem = val;
      this.dialogFormVisible = false;
      this.dialogFormVisible3 = true;
      this.activeNameGSF = 'first'
      this.getlistPipelinePrice(val);
    },
    // 用气客户设置
    userSetGPrice(val) {
      this.getuserchangeData = val;
      this.usergetPprice = val;
      this.activeNameUser = 'first'
      this.dialogFormVisible = false;
      this.dialogFormVisible2 = true;
      this.getlistCompPrice(val);
      this.editTimerUser++
    },
    ReportListdateChange(val) {
      // (Date.now() - new Date(date).getTime() > 0 && Date.now() - new Date(date).getTime() < 31*24*3600000)
      
      // if(new Date(val[1]).getTime()- new Date(val[0]).getTime() >10*24*3600000){
      //   this.gasReportDate = []
      //    alert('选择日期长度不不能大于十')
      // }
      if (this.getRepotTypeOptions == "01") {
        this.gasPrepaidReportList();
      } else if (this.getRepotTypeOptions == "02") {
        this.gasPriceRportList();
      } else if (this.getRepotTypeOptions == "03") {
        this.gasReportList();
      }
    },

    // 用气量计划部分

    // 获取日气量计划供应商
    listSupplier() {
      let data = {
        xaReig: this.$store.getters["curCom"],
      };
      api.dayGasD.listSupplier(data).then((res) => {
        this.listSupplierList = res;     
        let changeS = []
        changeS.push(this.listSupplierList[0].linfnr) 
        this.planForm.changeOptions = changeS
        this.reportChangeOptions = changeS  
        this.gasPriceRportchange = changeS
        this.getChangedSupplier = this.planForm.changeOptions
        // 供应商默认选择第一个，报表类型默认设置气量报表
        this.geulistComps('01',changeS)
        this.gasReportList()
        this.reportTypeChannge = ['03']
        this.getRepotTypeOptions =['03']
        this.reportTypeM = '03'
      });
    },
    // 日期格式转换
    getCusYear(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "/" +
        (m.length === 1 ? "0" + m : m) +
        "/" +
        (d.length === 1 ? "0" + d : d)
      );
    },
    getCusYear1(strDate) {
      if (strDate && strDate.length === 0) return "";
      let date = new Date(strDate);
      let y = date.getFullYear();
      let m = date.getMonth() + 1 + "";
      let d = date.getDate() + "";
      return (
        y +
        "-" +
        (m.length === 1 ? "0" + m : m) +
        "-" +
        (d.length === 1 ? "0" + d : d)
      );
    },
    // 获取燃气客户、供应商用气量
    geulistComps(val,item) {

      let filterCom
      if(val=='01'){
        filterCom = item
      }else{
         filterCom = this.getChangedSupplier.map((val) => {
        return val.linfnr;
      });
      }
     
      let data = {
        // codes: ["180032"],
        codes: filterCom,
        endTime: this.getCusYear(this.planForm.date),
        startTime: this.getCusYear(this.planForm.date),
      };
      if (filterCom.length > 0) {
        api.dayGasD.listComps(data).then((res) => {
          let getplanUserdata = [];
          let getData = res ? res[0].linfnr : [];
          let getChangedSupplierData = res[0].linfnr;
          getData.forEach((item) => {
            getplanUserdata = [...getplanUserdata, ...item.comp];
          });

          this.getChangedSupplier = getChangedSupplierData;
          this.planUserdata = getplanUserdata;
        });
      }
    },
    // 提交用气量
    planCommit() {
      let Supplier = this.deepClone(this.getChangedSupplier);
      let SupplierLastArray = [];
      Supplier.forEach((item) => {
        let obj = {};
        obj.id = item.planId;
        obj.gasNum = item.gasNum;
        obj.code = item.linfnr;
        obj.codeTxt = item.linfnrTxt;
        obj.time = this.getCusYear1(this.planForm.date);
        obj.type = "0";
        SupplierLastArray.push(obj);
      });
      let userDatachange = [];
      this.planUserdata.forEach((item) => {
        let obj = {};
        obj.id = item.id;
        obj.gasNum = item.gasNum;
        obj.code = item.compCode;
        obj.codeTxt = item.compCodeTxt;
        obj.time = this.getCusYear1(this.planForm.date);
        obj.type = "1";
        userDatachange.push(obj);
      });
      let contentArr = [...userDatachange, ...SupplierLastArray];
      if (this.planUserdata.length < 1 && this.getChangedSupplier.length < 1) {
        return;
      } else if (this.planUserdata.length < 1) {
        this.$message({
          message: "无用气客户，提交失败",
          type: "error",
          duration: 1000,
        });
      } else if (this.getChangedSupplier.length < 1) {
        this.$message({
          message: "无供应商数据，提交失败",
          type: "error",
          duration: 1000,
        });
      }
      if (this.getChangedSupplier.length > 0 && this.planUserdata.length > 0) {
        api.dayGasD.savegasJournalPlan(contentArr).then((res) => {
          if (res) {
            this.$message({
              message: "提交成功",
              type: "success",
              duration: 1000,
            });
            this.geulistComps();
          }
        });
      }
    },
    // 重置日气量
    resetBtn() {
      this.getChangedSupplier.forEach((item) => {
        item.gasNum = "";
      });
      this.planUserdata.forEach((item) => {
        item.gasNum = "";
      });
    },
    //   气量日报表部分
    changeRepotTypeOptions(getType) {
      // 01费用日报表
      // 02价格日报表
      // 03气量日报表
      this.reportTypeM = getType[0]
      this.getRepotTypeOptions = getType[0];

      if (getType[0] == "01") {
        this.gasPrepaidReportList();
      } else if (getType[0] == "02") {
        this.gasPriceRportList();
      } else if (getType[0] == "03") {
        this.gasReportList();
      }
    },
    // 获取费用日报表接口
    gasPriceRportList() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        lifnr: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasPriceRportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
      });
    },
    // 日气量报表
    gasReportList() {
      let data = {
        endTime: this.getCusYear1(this.gasReportDate[1]),
        startTime: this.getCusYear1(this.gasReportDate[0]),
        code: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasReportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
      });
    },
    // 获取费用日报表
    gasPrepaidReportList() {
      let data = {
        endDate: this.getCusYear1(this.gasReportDate[1]),
        startDate: this.getCusYear1(this.gasReportDate[0]),
        supplierCode: this.gasPriceRportchange[0], //供应商编码
      };
      api.dayGasD.gasPrepaidReportList(data).then((res) => {
        this.getPriceReportData = res ? res[0] : [];
        // if( this.getPriceReportData.length>0){
           this.getPriceReportData.dataList.forEach(item =>{
          if(item.date =='合计'){
              return
          }else{
               item.date = item.date?this.getCusYear(item.date):''
          }       
        })
        // }
      });
    },
    // 价格设置相关

  
    // 供应商价格设置
    nextBtnClicked() {
      this.saveLifnrsPrice();
    },
    // 获取供应商价格
    listLinrsPrice() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.listLinrsPrice(data).then((res) => {
        this.getGPriceItemData = res;
        this.getGPriceItemData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    deepClone(obj) {
      let _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
      return objClone;
    },
    // 保存设置价格供应商价格设置
    saveLifnrsPrice() {
      let deepData = this.deepClone(this.getGPriceItemData);
      deepData.forEach((item) => {
        let dateC = [];
        dateC[0] = this.getCusYear(item.shoArr[0]);
        dateC[1] = this.getCusYear(item.shoArr[1]);
        item.timeSlot = dateC.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        item.priceDesc.forEach((item) => {
          if (item.num === "超量") {
            item.num === "max";
          }
        });
        item.priceDesc = JSON.stringify(item.priceDesc);
      });

      api.dayGasD.saveLifnrsPrice(deepData).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false); //供应商弹框显示
          }, 1000);
        }
      });
    },
    // 获取管输方价格
    getlistPipelinePrice() {
      let data = {
        pipeLineCode: this.getGSFitem.code,
      };
      api.dayGasD.getlistPipelinePrice(data).then((res) => {
        this.getlistPipelinePriceData = res;
        this.getlistPipelinePriceData.map((item) => {
          return item.upGasPlace;
        });
        this.getPipelineUpGasPlace = res?res[0].upGasPlace:''
      });
      // getGSFitem
    },
    // 管输方价格设置
    savePipelinePrice() {
      api.dayGasD
        .savePipelinePrice(this.getlistPipelinePriceData)
        .then((res) => {
          if (res) {
            this.$message({
              message: "设置成功",
              type: "success",
              duration: 1000,
            });
            setTimeout(() => {
              (this.dialogFormVisible = true), //设置价格弹框显示
                (this.dialogFormVisible3 = false); //供应商弹框显示
            }, 1000);
          }
        });
    },
    // 管输方价格设置返回
    gsfBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible3 = false); //供应商弹框显示
    },
    // 用气客户价格设置返回
    userBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible2 = false); //供应商弹框显示
    },
    gysBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible1 = false); //供应商弹框显示
    },
    // 获取公司价格
    getlistCompPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.getlistCompPrice(data).then((res) => {
        this.getlistCompPriceData = res;
        this.getlistCompPriceData.forEach((item) => {
          let obj = {
            num: "超量",
            price: "",
          };
          let obj1 = {
            num: "",
            price: "",
          };
          let flag = false;
          //   $set(item,'shoArr',[])
          this.$set(item, "shoArr", []);
          if (item.priceDesc) {
            item.priceDesc = JSON.parse(item.priceDesc);
            item.priceDesc.forEach((item) => {
              if (item.num === "max" || item.num === "超量") {
                flag = true;
              }
            });
            if (!flag) {
              item.priceDesc.push(obj);
            }
          } else {
            item.priceDesc = [];
            item.priceDesc.push(obj1);
            item.priceDesc.push(obj);
          }
          (item.startDate = item.timeSlot.split("-")[0]),
            (item.endTime = item.timeSlot.split("-")[1]);
          item.shoArr = item.timeSlot.split("-");
        });
      });
    },
    // 保存公司价格
    saveCompPrice() {
      let data = this.deepClone(this.getlistCompPriceData);
      data.forEach((item) => {
        let asd = [];
        asd[0] = this.getCusYear(item.shoArr[0]);
        asd[1] = this.getCusYear(item.shoArr[1]);
        item.timeSlot = asd.join("-");
        item.shoArr = JSON.stringify(item.shoArr);
        delete item.shoArr;
        delete item.endTime;
        delete item.startDate;
        item.priceDesc.forEach((item) => {
          if (item.num === "超量") {
            item.num === "max";
          }
        });
        item.priceDesc = JSON.stringify(item.priceDesc);
      });

      api.dayGasD.saveCompPrice(data).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible2 = false); //供应商弹框显示
          }, 1000);
        }
      });
    },
    // 公司价格设置返回
    comBackBtn() {
      (this.dialogFormVisible = true), //设置价格弹框显示
        (this.dialogFormVisible2 = false); //供应商弹框显示
    },
    exportExcel: function () {
      let params = {
        cpmoCop: this.curComCode,
        startTime: this.startTime.toString(),
        endTime: this.endTime.toString(),
      };
      api.reply.export(params).then((res) => {
        this.download(res.data, "xls", "export");
      });
    },
    // 公司价格导出
    compsExportPrice() {
      let data = {
        companyCode: this.usergetPprice.code,
      };
      api.dayGasD.compsExportPrice(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商价格导出
    lifnrsExport() {
      let data = {
        lifnr: this.getGPriceItem.code,
      };
      api.dayGasD.lifnrsExport(data).then((res) => {
        this.download(res, "xls", "export");
      });
    },
    // 供应商预付费用保存
    setSupplierPricey() {
      let parames = {
        balancePrice: 0,
        code: this.getGPriceItem.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setSupplierPriceyD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: this.getFormatTime(this.setSupplierPriceyD.time),
        timeSlot: "",
        year: "",
      };
      api.dayGasD.setSupplierPricey(parames).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false); //供应商弹框显示
          }, 1000);
        }
      });
    },
    setCompPriceY() {
      let parames = {
        balancePrice: 0,
        code: this.getuserchangeData.code,
        codeTxt: "",
        gasPrice: "",
        id: 0,
        prepaidPrice: this.setCompPriceYD.prepaidPrice,
        priceDesc: "",
        priceType: "",
        status: "",
        time: this.getFormatTime(this.setCompPriceYD.time),
        timeSlot: "",
        year: "",
      };
      api.dayGasD.setCompPriceY(parames).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible1 = false); //供应商弹框显示
          }, 1000);
        }
      });
    },
   
    //  管输预付费用保存
    setPipelinePriceY() {
      let parames = {
        balancePrice: 0,
        id: 0,
        pipelineCode: this.getGSFitem.code,
        prepaidPrice: this.setPipelinePriceYD.prepaidPrice,
        time: this.getFormatTime(this.setPipelinePriceYD.time),
      };
      api.dayGasD.setPipelinePriceY(parames).then((res) => {
        if (res) {
          this.$message({
            message: "保存成功",
            type: "success",
            duration: 1000,
          });
          setTimeout(() => {
            (this.dialogFormVisible = true), //设置价格弹框显示
              (this.dialogFormVisible3 = false); //供应商弹框显示
          }, 1000);
        }
      });
    },
    tipPriceE() {
      let data = {
        time: this.getCusYear1(this.planForm.date),
      };
      api.dayGasD.tipPriceE(data).then((res) => {
        this.tipPriceData = res?res:[];
      });
    },
    // 供应商预付费用列表
    supplierPriceList(val) {
      this.setSupplierPriceyD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getGPriceItem.code,
        time: this.getCusYear1(getDate),
      };
      api.dayGasD.getPrepaidPriceData(data).then((res) => {
        // (this.supplierPriceListData = res[0].list[0]), //供应商预付费用列表数据
          this.setSupplierPriceyD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:''
          this.setSupplierPriceyD.time = res[0].time?res[0].time:'';
      });
      // api.dayGasD.supplierPriceList(data).then((res) => {
      //   (this.supplierPriceListData = res[0].list[0]), //供应商预付费用列表数据
      //     (this.setSupplierPriceyD.prepaidPrice = this.supplierPriceListData.prepaidPrice);
      //   this.setSupplierPriceyD.time = this.supplierPriceListData.time;
      // });
    },
    // 公司预付费用列表
    compPriceList(val) {
      this.setCompPriceYD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getuserchangeData.code,
        time: this.getCusYear1(getDate)
      }
      api.dayGasD.getCompPrepaidPrice(data).then((res) => {
        // this.compPriceListData = res[0].list[0];
        this.setCompPriceYD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:'';
        this.setCompPriceYD.time = res[0].time?res[0].time:'';
      });
    },
    // 供应商
    changeCompForm(val){
     this.supplierPriceList(val)
    },
    // 用气客户
    changeUserForm(val){
       this.compPriceList(val)
    },
    // 管输方
    changePipelineForm(val){
        this.pipelinePriceList(val)
    },
    // 管输预付费用列表
    pipelinePriceList(val) {
      this.setPipelinePriceYD.prepaidPrice = ''
      let getDate = val?val:this.planForm.date
      let data = {
        code: this.getGSFitem.code,
        time: this.getCusYear1(getDate),
      };
       api.dayGasD.getPipelinePriceData(data).then((res) => {
        // (this.pipelinePriceListData = res[0].list[0]), //管输预付费用列表数据
          this.setPipelinePriceYD.prepaidPrice = res[0].prepaidPrice?res[0].prepaidPrice:''
          this.setPipelinePriceYD.time = res[0].time?res[0].time:''
      });

      // api.dayGasD.pipelinePriceList(data).then((res) => {
      //   (this.pipelinePriceListData = res[0].list[0]), //管输预付费用列表数据
      //     (this.setPipelinePriceYD.prepaidPrice = this.pipelinePriceListData.prepaidPrice),
      //     (this.setPipelinePriceYD.time = this.pipelinePriceListData.time);
      // });
    },
  },
};
</script>
<style lang='scss'>


.day-gas-container {
  // width: 100%;
  //   background-image: url(../../static/img/over-bg.e7f64e87.png);
    background-size: 100% 450px;
  //   background-repeat: no-repeat;
  //   opacity: 1;
  //   overflow: hidden;
  //   padding-bottom: 60px;
  //   min-width: 1440px;
  //   position: relative;
  .supplier-list{
    .el-form-item{
      position: relative;
      .el-input__inner{
        border: none;
        border-radius: 5px 18px 18px 5px;
        padding: 0 20px;
      }
    }
    .el-form-item__label{
          width: 180px;
    position: absolute;
    left: 15px;
    z-index: 12;
    }
  }
  .el-date-editor .el-range-separator{
    width: 0%;
  }
  .date-picker-change{
     .el-input__inner{
        width: 90%!important;
     }
  }
  .price-custom{
     .el-input__inner{
        width: 90%!important;
     }
     .custom-unit {
          position: absolute;
          top: 0;
          right: 105px;
          color: #74788d;
        }
  }
  .date-picker .el-range-separator {
    color: #443939;
}
.date-picker .el-range-input{
  width: 100px;
}
  .submitBtn-day {
    background: #e5f6f6;
    border-radius: 20px;
    border: none;
    color: #0fb2ab;
  }
  .el-table--border,
  .el-table--group {
    border: none;
  }
  .el-table--border::after,
  .el-table--group::after,
  .el-table::before {
    background: none;
  }

}
</style>
<style lang='scss' scoped>
.day-gas-mask{
    height: 100%;
    background: linear-gradient(180deg, #1a3e97 53%, #1042bc00 64%);
}
.day-gas-container {
  // height: 500px;
  /deep/.el-input__inner {
    border-radius: 18px;
    background: #f6f7fa;
    width: 100%;
  }

  /deep/.el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e5e5e5;
    line-height: 40px;
    font-size: 24px;
    .el-dialog__headerbtn {
      font-size: 23px;
    }
  }
  /deep/.el-tabs__content {
    .el-radio-group {
      width: 100%;
      display: flex !important;
      // margin-left: 10px;
    }
    .el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      // border: 1px solid #0FB2AB;
      background: #f6f7fa;
      padding: 13px 30px;
      border-radius: 30px;
      width: 28%;
    }
    .is-checked.el-radio {
      color: #606266;
      cursor: pointer;
      // margin: 0 15px;
      border: 1px solid #0fb2ab;
      padding: 13px 30px;
      border-radius: 30px;
      background: #ffffff;
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #0fb2ab;
        background: #0fb2ab;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #0fb2ab;
      }
    }
  }
  
  .set-price {
    padding: 30px;
    .title {
      margin: 20px;
    }
    .list-com {
      display: flex;
      padding: 10px;
      flex-wrap: wrap;

      .supplier-input {
        width: 50%;
        .el-input__inner {
          padding: 0 25px;
          color: red;
          background: red !important;
        }
      }
    }
    .price-list {
      .list-itemC {
        border: 1px solid #0fb2ab;
      }
      .list-item {
        min-width: 32%;
        color: pink;
        border-radius: 100px;
        background: #f6f7fa;
        // border: 1px solid #0fb2ab;
        line-height: 44px;
        display: flex;
        justify-content: space-between;
        height: 44px;
        margin-right: 10px;
        margin-bottom: 20px;
        .el-icon-error {
          color: #4f4c4c;
        }
        .uncheced {
          margin: -2px 22px;
        }
        /* border: 1px solid; */
        // box-shadow: 0px 10px 20px rgb(38 51 88 /W 7%);
        &:hover {
          opacity: 1;
          background: #ffffff;
          .set-btn {
            opacity: 1;
          }
        }

        i {
          padding: 0 20px;
          color: #0fb2ab;
        }
        label {
          color: #ccc;
          // background: #EDEEF4;
          // padding: 10px 15px;
          // border-radius: 19px;
        }
        .set-btn {
          opacity: 0;
          padding: 0 13px;
          line-height: 24px;
          height: 24px;
          vertical-align: middle;
          display: inline-block;
          /* margin-top: 4px; */
          color: #0fb2ab;
          margin-right: 10px;
          background: #ffffff;
          border: 1px solid #0fb2ab40;
          // opacity: 0.3;
          border-radius: 16px;
          align-self: center;
        }
      }
    }
  }
  .set-detail {
    width: 80%;
    margin: 0 auto;
    .detail-title {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      .title-left {
        .com-name {
          margin-right: 20px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 600;
          line-height: 33px;
          color: #2c3e50;
          opacity: 1;
        }
        .com-code {
          padding: 1px 10px;
          border-radius: 20px;
          background: #f6f7fa;
          color: #74788d;
          display: inline-block;
          vertical-align: middle;
           margin-bottom: 10px;
        }
      }
      .submitBtn {
        color: #0fb2ab;
        background: #fff;
        border: 1px solid #0fb2ab;
        border-radius: 100px;
      }
    }
    .detail-content {
      .addprice-btn{
            width: 119px;
            background: #0fb2ab;
            color: #ffffff;
            padding: 11px 20px;
            border-radius: 30px;
            margin-top: 20px;
            text-align: center;
          }
      .custom-tab {
        .custom-label {
          position: absolute;
          top: 0;
          left: 12px;
          color: #74788d;
        }
        .custom-unit {
          position: absolute;
          top: 0;
          right: 18px;
          color: #74788d;
        }
         .price-custom{
     .custom-unit {
          position: absolute;
          top: 0;
          right: 105px;
          color: #74788d;
        }
  }

        .step-input {
          /deep/.el-input {
            .el-input__inner {
              padding: 0 43px;
            }
          }
        }

        /deep/.date-picker {
          .el-range-input {
            background: none;
          }
        }
        /deep/.el-tabs__nav {
          .el-tabs__item {
            margin-bottom: 20px;
            height: 20px;
            line-height: 20px;
          }
          .el-tabs__item.is-active {
            color: #0fb2ab;
          }
          .el-tabs__active-bar {
            background: #0fb2ab;
            width: 88px !important;
            left: -13px;
          }
          #tab-first {
            border-right: 1px solid #e4e4e4;
            padding-left: 16px;
          }
        }
      }
      .del-step {
        padding: 3px 8px;
        vertical-align: top;
        display: inline-block;
        /* line-height: 36px; */
        border-radius: 20px;
        border: 1px solid;
        margin-top: 8px;
        margin-left: 10px;
      }
      .tab-content {
        padding: 20px 0px;
        .addprice-btn{
            width: 119px;
            background: #0fb2ab;
            color: #ffffff;
            padding: 11px 20px;
            border-radius: 30px;
            margin-left: 32px;
          }
        .content-item {
          padding: 40px 2px;
          
        }
        .del-price-btn{
          background: #0fb2ab;
          text-align: center;
          width: 12%;
          border-radius: 20px;
          padding: 10px;
          color: #ffffff;
          margin: 29px 35px;

        }
        .add-step {
          background: #fff;
          border-radius: 20px;
          color: #0fb2ab;
          margin: 15px 50px 50px;
        }
        .com-btn {
          display: flex;
          justify-content: space-between;
          padding: 50px 10px;
          .el-button {
            width: 114px;
            height: 46px;
            background: #ffffff;
            border: 1px solid #d2d2dc;
            opacity: 1;
            border-radius: 100px;
            font-family: PingFang SC;
            font-weight: 500;
            i {
              margin-right: 5px;
            }
          }
          .save-btn {
            background: #0fb2ab;
            opacity: 1;
            border-radius: 100px;
            border: none;
          }
        }
        .el-input {
          width: 100%;
        }
      }
    }
    .loser-detail {
      .loser-top {
        padding: 20px 10px;
        display: inline-block;
      }
      .loser-list {
        .list-top {
          display: flex;
          padding: 20px;
          .list-top-com {
            flex: 1;
            .custom-tooltip {
              position: relative;
              display: inline-block;
              color: #0fb2ab;
              .tooltip {
                opacity: 1;
                position: absolute;
                top: 7px;
                left: 21px;
                width: 64px;
                height: 28px;
                line-height: 28px;
                /* padding: 0 10px; */
                background: #e5f6f6;
                border-radius: 9px;
                color: #0fb2ab;
                text-align: center;
                .popper__arrow {
                  position: absolute;
                  left: -11px;
                  top: 12px;
                  display: block;
                  width: 0;
                  height: 0;
                  border-color: transparent;
                  border-style: solid;
                  border-width: 6px;
                  border-right-color: #e5f6f6;
                }
              }
            }
          }
          .list-top-com:hover .tooltip {
            opacity: 1;
          }
        }
      }
    }
  }
  .top-bag {
    // background: linear-gradient(180deg, #2146a1 0%, #d7dbe10a 100%);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding-bottom: 3px;
    .top-header {
      padding: 1px;
    }
    .top-title {
      padding-top: 20px;
      .top-con {
        // width: 80%;
        background: linear-gradient(
        180deg
        ,#3497D4 10%, #33c8ff9e 30%);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            padding-bottom: 3px;
            border-radius: 10px;
            padding: 23px;
            margin: 30px;
            margin-bottom: 0;
        .title {
          line-height: 35px;
          font-weight: 500;
          color: #ffffff;
          font-size: 24px;
          letter-spacing: 2px;
        }
        .plan-search-label{
          color: #ffffff;
          margin-right: 12px;
        }
        .gas-content {
          border-radius: 6px;
          background: #ffffff;
          padding: 30px 10px;
          margin: 0 auto;
          margin-top: 16px;
          position: relative;
          .plan-list-title{
            margin-left: 30px;
            font-size: 16px;
            font-weight: 700;
          }
          .list-com {
            display: flex;
            padding: 10px;
            flex-wrap: wrap;
            &.user-list {
              .custom-tooltip {
                position: relative;
                display: inline-block;
                color: #0fb2ab;
                position: absolute;
                right: 134px;
                .tooltip {
                 opacity: 1;
                  position: absolute;
                  top: 7px;
                  left: 21px;
                  width: 64px;
                  height: 28px;
                  line-height: 28px;
                  background: #e5f6f6;
                  border-radius: 9px;
                  color: #0fb2ab;
                  text-align: center;
                  .popper__arrow {
                    position: absolute;
                    left: -11px;
                    top: 12px;
                    display: block;
                    width: 0;
                    height: 0;
                    border-color: transparent;
                    border-style: solid;
                    border-width: 6px;
                    border-right-color: #e5f6f6;
                  }
                }
              }
            }
            .list-item {
              // flex: 1;
              width: 30%;
              margin-right: 20px;

              /deep/ label {
                background: #edeef4;
                background: #edeef4;
                border-radius: 100px;
                text-align: center;
              }
              .supplier-input {
                width: 50%;
                position: relative;
                .el-input__inner {
                  padding: 0 25px;
                  color: red;
                  background: red !important;
                }
              }
              .custom-unit {
                position: absolute;
                top: 0;
                right: 18px;
                color: #74788d;
              }
            }
          }
          .price-tag {
            position: absolute;
            top: -25px;
            right: 10px;
            .setPrice {
              background: #0fb2ab;
              border-radius: 100px;
              color: #ffffff;
              padding: 13px 37px;
            }
            
             
            .tip-balance {
              display: inline-block;
              position: relative;
              // width: 50px;
              // height: 50px;
              border-radius: 100%;
              // background: red;
              line-height: 50px;
              text-align: center;
              color: #fff;
              margin-left: 15px;
              z-index: 999;
              img{
                vertical-align: middle;
                width: 60px;
                height: 60px;
              }
              .tip-number {
                position: absolute;
                top: 0px;
                right: 0px;
                width: 17px;
                height: 17px;
                background: #d51313;
                border-radius: 50px;
                line-height: 19px;
                font-size: 14px;
                border: 3px solid blue;
              }

              .tip-content {
                width: 0;
                // opacity: 0;
                display: none;

                .solid-core {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: red;
                  position: relative;
                  top: -22px;
                  left: 34%;
                }
                .hollow {
                  width: 0;
                  height: 0;
                  border: 10px solid transparent;
                  border-bottom-color: #fff1ea;
                  position: relative;
                  top: -40px;
                  left: 34%;
                  z-index: 2;
                }
                .tip-list {
                  padding: 18px 28px;
                  width: 380px;
                  position: absolute;
                  overflow: auto; 
                  max-height: 520px;
                  border: 2px solid red;
                  border-radius: 8px;
                  background: #fff1ea;
                  top: 58%;
                  right: -9px;
                  color: #ff523c;
                  text-align: left;
                  line-height: 35px;
                  padding-left: 50px;
                  z-index: 1;
                  .tip-icon {
                    position: absolute;
                    left: 20px;
                    top: 25px;
                    // opacity: 0;
                  }
                  .tip-list-item {
                    line-height: 30px;
                    border-bottom: 1px solid #ff523c;
                    padding: 10px 0;
                    .supplier-title {
                      font-weight: 700;
                    }
                    .balance {
                      .balance-number {
                        font-weight: 700;
                      }
                    }
                  }
                  .tip-list-item:last-child {
                    border: none;
                  }
                }
              }
              .tip-content-show{
                 opacity: 1;
                 display: block;
                .tip-icon {
                  opacity: 1;

                }
              }
              .tip-balance-con{
                &:hover .tip-content {
                opacity: 1;
                .tip-icon {
                  opacity: 1;
                }
              }
              }
             
            }
          }
          .planSubmit {
            margin: 0px 30px;
            margin-bottom: 10px;
            .el-button {
              border-radius: 20px;
            }
            .submitBtn {
              background: #0fb2ab;
              padding: 15px 60px;
            }
            .resetBtn {
              background: #ffffff;
              color: #999;
              padding: 15px 30px;
            }
          }
        }
      }
    }
  }
  .tabel-container {
    padding: 27px;
    background: #fff;
    margin: 30px;
    border-radius: 10px;
    .table-search {
      padding: 10px;
      .derive-btn{
          text-align: right;
      }
      .day-table-date {
        //   /deep/.el-date-editor{

        //   }
        /deep/ .el-range-editor {
          width: 81%;

          .el-range-input {
            background: none;
          }
        }
      }
      .title {
        line-height: 45px;
        font-weight: 700;
        font-size: 24px;
      }
    }
    .table-unit {
      margin: 10px;
      color: #74788d;
      font-size: 18px;
    }
  }
}
// @import '~@/pages/purchaseAnalysis/style/index';
</style>
